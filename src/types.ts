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
  onClick: () => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}
