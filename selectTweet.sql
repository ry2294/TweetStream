/****** Script for SelectTopNRows command from SSMS  ******/
SELECT count(*) FROM [TweetMap].[dbo].[tweet_tbl] nolock;

 SELECT count(*) FROM [TweetMap].[dbo].[place_tbl] nolock;

  SELECT count(*) FROM [TweetMap].[dbo].[hashtagtoplace_tbl] nolock;

  SELECT * FROM [TweetMap].[dbo].[tweet_tbl] nolock;

 SELECT * FROM [TweetMap].[dbo].[place_tbl] nolock order by tweetcount desc;

  SELECT * FROM [TweetMap].[dbo].[hashtagtoplace_tbl] nolock order by tweetcount desc;