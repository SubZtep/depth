export const VIDEO_KEYFRAME_TIMESTAMPS = (memfsFilename: string) => `-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" ")

// export const VIDEO_KEYFRAME_IMAGES = (memfsFilename: string) => `-skip_frame nokey -i ${memfsFilename} -vsync 0 -r 1000 -frame_pts 1 %09d.png`.split(" ")
export const VIDEO_KEYFRAME_IMAGES = (memfsFilename: string) => `-skip_frame nokey -i ${memfsFilename} -vf scale=-1:69 -vsync 0 -r 1000 -frame_pts 1 %09d.png`.split(" ")
