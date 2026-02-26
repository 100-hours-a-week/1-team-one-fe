import { access, mkdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const MIN_WEIGHT_BYTES = 1024 * 100;

const MODEL_SOURCES = [
  {
    name: 'blazeface',
    modelJsonUrl:
      'https://www.kaggle.com/models/tensorflow/blazeface/tfJs/default/1/model.json?tfjs-format=file&tfhub-redirect=true',
  },
  {
    name: 'facemesh',
    modelJsonUrl:
      'https://www.kaggle.com/models/mediapipe/facemesh/tfJs/default/1/model.json?tfjs-format=file&tfhub-redirect=true',
  },
  {
    name: 'iris',
    modelJsonUrl:
      'https://www.kaggle.com/models/mediapipe/iris/tfJs/default/2/model.json?tfjs-format=file&tfhub-redirect=true',
  },
];

const stripQueryAndHash = (value) => value.split('#')[0]?.split('?')[0] ?? value;

const toFileName = (value) => path.posix.basename(stripQueryAndHash(value));

const fileExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getFileSize = async (filePath) => {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
};

const isValidWeightFile = async (filePath) => {
  const size = await getFileSize(filePath);
  return size >= MIN_WEIGHT_BYTES;
};

const readJsonIfExists = async (filePath) => {
  if (!(await fileExists(filePath))) return null;
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
};

const extractLocalWeightFileNames = (modelJson) => {
  if (!modelJson || !Array.isArray(modelJson.weightsManifest)) {
    throw new Error('Invalid model.json: weightsManifest is missing.');
  }

  const fileNames = new Set();
  modelJson.weightsManifest.forEach((group) => {
    if (!group || !Array.isArray(group.paths)) {
      throw new Error('Invalid model.json: weightsManifest.paths is missing.');
    }
    group.paths.forEach((pathValue) => {
      fileNames.add(toFileName(String(pathValue)));
    });
  });

  return [...fileNames];
};

const buildWeightDownloadUrl = (pathText, modelJsonUrl) => {
  if (pathText.startsWith('http')) return pathText;

  const resolvedUrl = new URL(pathText, modelJsonUrl);
  if (resolvedUrl.search) return resolvedUrl.toString();

  const modelUrl = new URL(modelJsonUrl);
  if (modelUrl.searchParams.get('tfjs-format') === 'file') {
    resolvedUrl.searchParams.set('tfjs-format', 'file');
  }

  return resolvedUrl.toString();
};

const normalizeModelJson = (modelJson, modelJsonUrl) => {
  if (!modelJson || !Array.isArray(modelJson.weightsManifest)) {
    throw new Error('Invalid model.json: weightsManifest is missing.');
  }

  const weightMap = new Map();
  const weightsManifest = modelJson.weightsManifest.map((group) => {
    if (!group || !Array.isArray(group.paths)) {
      throw new Error('Invalid model.json: weightsManifest.paths is missing.');
    }

    const normalizedPaths = group.paths.map((pathValue) => {
      const pathText = String(pathValue);
      const fileName = toFileName(pathText);
      const downloadUrl = buildWeightDownloadUrl(pathText, modelJsonUrl);

      if (!weightMap.has(fileName)) {
        weightMap.set(fileName, downloadUrl);
      }

      return fileName;
    });

    return { ...group, paths: normalizedPaths };
  });

  const weights = [...weightMap.entries()].map(([fileName, downloadUrl]) => ({
    fileName,
    downloadUrl,
  }));

  return {
    modelJson: { ...modelJson, weightsManifest },
    weights,
  };
};

const downloadBinary = async (url, filePath) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < MIN_WEIGHT_BYTES) {
    const contentType = response.headers.get('content-type') ?? 'unknown';
    throw new Error(
      `Downloaded weight is too small (${buffer.length} bytes, ${contentType}) from ${url}`,
    );
  }
  await writeFile(filePath, buffer);
};

const main = async () => {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const appRoot = path.resolve(currentDir, '..');
  const modelsRoot = path.join(appRoot, 'public', 'models', 'webgazer');

  await mkdir(modelsRoot, { recursive: true });

  for (const source of MODEL_SOURCES) {
    const modelDir = path.join(modelsRoot, source.name);
    await mkdir(modelDir, { recursive: true });

    const modelJsonPath = path.join(modelDir, 'model.json');
    const localModelJson = await readJsonIfExists(modelJsonPath);

    if (localModelJson) {
      const localWeights = extractLocalWeightFileNames(localModelJson);
      const weightChecks = await Promise.all(
        localWeights.map((fileName) => isValidWeightFile(path.join(modelDir, fileName))),
      );

      if (weightChecks.every(Boolean)) {
        console.log(`[webgazer] ${source.name}: already downloaded.`);
        continue;
      }
    }

    console.log(`[webgazer] ${source.name}: downloading...`);

    const modelResponse = await fetch(source.modelJsonUrl);
    if (!modelResponse.ok) {
      throw new Error(
        `Failed to download model.json (${source.name}): ${modelResponse.status}`,
      );
    }

    const modelJson = await modelResponse.json();
    const { modelJson: normalizedModelJson, weights } = normalizeModelJson(
      modelJson,
      source.modelJsonUrl,
    );

    await writeFile(modelJsonPath, JSON.stringify(normalizedModelJson, null, 2));

    for (const weight of weights) {
      const weightPath = path.join(modelDir, weight.fileName);
      if (await isValidWeightFile(weightPath)) continue;
      await downloadBinary(weight.downloadUrl, weightPath);
    }

    console.log(`[webgazer] ${source.name}: complete.`);
  }
};

main().catch((error) => {
  console.error('[webgazer] download failed:', error);
  process.exitCode = 1;
});
