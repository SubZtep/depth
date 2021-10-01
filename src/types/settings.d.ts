/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Project settings — router and other basic stuff
 */
export interface Settings {
  router: Router;
  sounds?: Sound;
}
export interface Router {
  /**
   * Camera transitions between states
   */
  transition?: boolean;
  routes: Route[];
}
export interface Route {
  /**
   * The path of the route
   */
  path: string;
  /**
   * Menu item label
   */
  label?: string;
  /**
   * Page component name, pattern: `./components/pages/[VALUE].vue`
   */
  component?: string;
  /**
   * Initial camera position
   */
  position?: [number, number, number];
  /**
   * Initial camera rotation
   */
  lookAt?: [number, number, number];
}
export interface Sound {
  /**
   * Master volume of the sounds
   */
  volume?: number;
  /**
   * Sounds samples
   */
  samples?: {
    denied?: string;
  };
}
