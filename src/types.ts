export interface ActiveRepo {
  name: string;
  branch: string;
  url: string;
}

export interface KeyData {
  label: string;
  color: string;
}

export interface KeyDataList extends Array<KeyData> {}

export interface ProjectNode {
  x: number;
  y: number;
  z: number;
  color: string;
  index: number;
  name: string;
  url: string;
  branch: string;
  onClick: () => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  activeRepo: ActiveRepo;
}
