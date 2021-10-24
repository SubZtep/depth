import { Plugin } from "vue";
import dat from "dat.gui";
import "./style.css";
declare type FolderInit = (folder: dat.GUI) => void;
declare const plugin: Plugin;
export default plugin;
export declare function useGui(options?: {
    close?: boolean;
}): any;
export declare function addGuiFolder(init: FolderInit): any;
