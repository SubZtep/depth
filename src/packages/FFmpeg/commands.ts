export const KEYFRAME_TIMESTAMPS = (memfsFilename: string) => `-i ${memfsFilename} -hide_banner -vf showinfo -vsync 0 -start_number 0 -f null /dev/null`.split(" ")

export const KEYFRAME_IMAGES = (memfsFilename: string, outDir: string, height = 69) => `-skip_frame nokey -i ${memfsFilename} -vf scale=-1:${height} -vsync 0 -r 1000 -frame_pts 1 ${outDir}%09d.png`.split(" ")

export const KEYFRAME_TIMESTAMPS_LOG = /^.*pts_time:([0-9]+\.?[0-9]*).*$/
