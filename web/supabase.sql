CREATE TABLE video (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  src varchar NOT NULL,
  width int2 NOT NULL,
  height int2 NOT NULL,
  duration float4 NOT NULL
);

CREATE TABLE keyframe (
  id SERIAL PRIMARY KEY,
  video_id SERIAL,
  ts float4 NOT NULL,
  CONSTRAINT fk_video FOREIGN KEY(video_id) REFERENCES video(id)
);

CREATE TABLE pose (
  id SERIAL PRIMARY KEY,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  video_id SERIAL,
  ts float4 NOT NULL,
  pose_raw json,
  pose_normalized json NOT NULL,
  CONSTRAINT fk_video FOREIGN KEY(video_id) REFERENCES video(id)
);