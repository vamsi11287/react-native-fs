export interface PhotoNode {
  node: {
    image: {
      uri: string;
    };
  };
}

export interface PhotosResponse {
  photos: PhotoNode[];
}

interface Navigation {
  addListener: (event: string, callback: () => void) => void;
  canGoBack: () => boolean;
  dispatch: (action: any) => void;
  getId: () => string | undefined;
  getParent: () => any | undefined;
  getState: () => any;
  goBack: () => void;
  isFocused: () => boolean;
  jumpTo: (routeName: string) => void;
  navigate: (routeName: string, params?: any) => void;
  pop: () => void;
  popToTop: () => void;
  push: (routeName: string, params?: any) => void;
  removeListener: (event: string, callback: () => void) => void;
  replace: (routeName: string, params?: any) => void;
  reset: (state: any) => void;
  setOptions: (options: any) => void;
  setParams: (params: any) => void;
}

interface Route {
  key: string;
  name: string;
  params?: any;
}

export interface ImagesProps {
  images: PhotosResponse;
  navigation: Navigation;
  route: Route;
}

export interface Ifolder {
  name: string;
  path: string;
}

export interface IFolder_FIle {
  name: string;
  path: string;
}

export interface IPath_FileName {
  path?: string;
  name?: string;
}

export interface IpopupModel {
  path: string;
  name: string;
  setName: () => void;
  isVisible: boolean;
  setModalVisible: () => void;
  createFileInFolder: () => void;
  allFiles: IFolder_FIle;
}

export interface IRednderImages {
  node: {
    group_name: [];
    id: string;
    image: {
      extension: null;
      fileSize: null;
      filename: null;
      height: null;
      orientation: null;
      playableDuration: null;
      uri:string;
      width: null;
    };
    location: null;
    modificationTimestamp:number;
    sourceType: null;
    subTypes: [];
    timestamp: number;
    type: string;
  };
}
