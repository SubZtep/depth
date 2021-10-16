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
  audio?: AudioSettings;
  video?: VideoSettings;
}
export interface AudioSettings {
  /**
   * Master volume
   */
  volume?: number;
  /**
   * Sounds samples
   */
  samples?: {
    denied?: string;
  };
}
export interface VideoSettings {
  /**
   * Attached video clips
   */
  clips?: string[];
}
