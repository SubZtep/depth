export const VIDEO_KEYFRAME_TIMESTAMPS = (memfsFilename: string) => `-i ${memfsFilename} -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" ")

export const VIDEO_KEYFRAME_IMAGES = (memfsFilename: string, outDir: string, height = 69) => `-skip_frame nokey -i ${memfsFilename} -vf scale=-1:${height} -vsync 0 -r 1000 -frame_pts 1 ${outDir}%09d.png`.split(" ")
