import { generateSlug } from "random-word-slugs";
import * as THREE from "three"
import { sphereFactory, videoPlayerMeshFactory } from "./factories";
import { useGlobalState } from "../store"
import { get } from "@vueuse/core";
import { reactive, watch } from "vue";

/** Hold video, stickmen and lot of static stuff */
export class Pile {
  id: string
  rootGroup: THREE.Group
  
  // stickman: Stickman
  videoPlayer: VideoPlayerMesh

  ratio = 2

  constructor() {
    this.id = generateSlug()
    this.rootGroup = new THREE.Group()
    this.rootGroup.name = this.id
    this.videoPlayer = videoPlayerMeshFactory()
    this.rootGroup.add(this.videoPlayer)
    // this.rootGroup.add(sphereFactory()) 

    // const state = useGlobalState()
    // watch(state, newState => {
    //   console.log("STATE", state)
    // }, { immediate: true, deep: true })
  }
  
  applyVideoPlayerTexture(el: HTMLVideoElement) {
    const texture = new THREE.VideoTexture(el)
    this.videoPlayer.material.map = texture
    this.videoPlayer.material.needsUpdate = true
  }

  state: PileState = {} as PileState


  toState(): PileState {
    const state = {
      id: this.id,
      position: this.rootGroup.position, // update real-time, if object pass
      videoPlayer: {
        visibleEl: false,
        visibleObj: this.videoPlayer.visible,
        width: this.videoPlayer.scale.x,
      }
    }
    return state
    // return {
    //   id: this.id,
    //   position: this.rootGroup.position, // update real-time, if object pass
    //   videoPlayer: {
    //     visible: this.videoPlayer.visible,
    //     width: this.videoPlayer.scale.x,
    //   }
    // }
  }
}