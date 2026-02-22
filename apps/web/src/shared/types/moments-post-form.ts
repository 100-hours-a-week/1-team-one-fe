export type MomentsPostImageItem =
  | {
      id: string;
      type: 'existing';
      path: string;
    }
  | {
      id: string;
      type: 'new';
      file: File;
    };

export interface MomentsPostFormValues {
  title: string;
  content: string;
  tags: string[];
  images: MomentsPostImageItem[];
}
