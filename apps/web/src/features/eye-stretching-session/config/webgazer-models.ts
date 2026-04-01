const WEBGAZER_MODEL_LOCAL_BASE_PATH = '/models/webgazer';

export const WEBGAZER_MODEL_REDIRECTS = [
  {
    from: 'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/blazeface/`,
  },
  {
    from: 'https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/facemesh/`,
  },
  {
    from: 'https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/iris/`,
  },
  {
    from: 'https://www.kaggle.com/models/tensorflow/blazeface/tfJs/default/1/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/blazeface/`,
  },
  {
    from: 'https://www.kaggle.com/models/mediapipe/facemesh/tfJs/default/1/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/facemesh/`,
  },
  {
    from: 'https://www.kaggle.com/models/mediapipe/iris/tfJs/default/2/',
    to: `${WEBGAZER_MODEL_LOCAL_BASE_PATH}/iris/`,
  },
] as const;
