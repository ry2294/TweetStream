-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
DROP PROCEDURE insertTweet
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE insertTweet (
@tweetId nvarchar,
@text nvarchar,
@hashTag nvarchar,
@userId nvarchar,
@userName nvarchar,
@geo nvarchar,
@coordinates nvarchar,
@place_id nvarchar,
@placeType nvarchar,
@placeName nvarchar,
@fullName nvarchar,
@countryCode nvarchar,
@country nvarchar,
@boundingBox nvarchar
)
AS
BEGIN
	IF not exists(select 1 from place_tbl where id = @place_id)
		BEGIN
			insert into place_tbl (id, placeType, placeName, fullName, countryCode, country, boundingBox, tweetCount)
			values(@place_id, @placeType, @placeName, @fullName, @countryCode, @country, @boundingBox, 0);
		END
	
	DECLARE @placeId DECIMAL(38,0)
	DECLARE @placeTweetCount DECIMAL(38,0)
	select @placeId = placeId, @placeTweetCount = tweetCount from place_tbl where id = @place_id;

	update place_tbl
	set tweetCount = (@placeTweetCount + 1)
	where placeId = @placeId

	IF not exists (select 1 from tweet_tbl where tweetId = @tweetId)
		BEGIN
			insert into tweet_tbl (tweetId, createdTime, text, placeId, hashTag, userId, userName, geo, coordinates) 
			values(@tweetId, GETDATE(), @text, @placeId, @hashTag, @userId, @userName, @geo, @coordinates);
		END

	IF NOT EXISTS(select 1 from hashtagtoplace_tbl where hashTag = @hashTag and placeId = @placeId)
		begin
			insert into hashtagtoplace_tbl(hashTag, placeId, tweetCount)
			values(@hashTag, @placeId, 0)
		end

	DECLARE @hashTagPlaceTweetCount DECIMAL(38,0)
	select @hashTagPlaceTweetCount = tweetCount from hashtagtoplace_tbl where hashTag = @hashTag and placeId = @placeId

	update hashtagtoplace_tbl
	set tweetCount = (@hashTagPlaceTweetCount + 1)
	where hashTag = @hashTag and placeId = @placeId

	select 1
END
GO