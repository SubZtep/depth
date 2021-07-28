DELETE FROM keypoint;
DELETE FROM pose;
DELETE FROM video;
-- INSERT INTO video (filename, length, width, height) VALUES ('yoga2.webm', 16000, 480, 480);


CREATE TABLE video (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  filename varchar NOT NULL,
  duration float4 NOT NULL,
  width int2 NOT NULL,
  height int2 NOT NULL
);

CREATE TABLE pose (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  video_id SERIAL,
  time float4 NOT NULL,
  type int2 NOT NULL,
  CONSTRAINT fk_video FOREIGN KEY(video_id) REFERENCES video(id)
);

CREATE TABLE keypoint (
  pose_id SERIAL,
  x float4 NOT NULL,
  y float4 NOT NULL,
  z float4 NOT NULL,
  visibility float4,
  index int2 NOT NULL,
  PRIMARY KEY (pose_id, name),
  CONSTRAINT fk_pose FOREIGN KEY(pose_id) REFERENCES pose(id)
);
