export interface DesignTokenMap {
  [key: string]: ColorToken;
}

interface ColorToken {
  $value: string;
  $type: 'color';
}


