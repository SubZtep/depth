
CREATE TABLE video (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  filename varchar NOT NULL,
  length int4 NOT NULL,
  width int2 NOT NULL,
  height int2 NOT NULL
);

INSERT INTO video (filename, length, width, height) VALUES ('yoga2.webm', 16000, 480, 480);

CREATE TABLE pose (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  video_id SERIAL,
  length int4 NOT NULL,
  CONSTRAINT fk_video FOREIGN KEY(video_id) REFERENCES video(id)
);

-- create moopre (normalized etc)
CREATE TABLE landmark (
  pose_id SERIAL,
  name varchar NOT NULL,
  x float4 NOT NULL,
  y float4 NOT NULL,
  z float4 NOT NULL,
  visibility float4,
  PRIMARY KEY (pose_id, name),
  CONSTRAINT fk_pose FOREIGN KEY(pose_id) REFERENCES pose(id)
);

