/**
	jQuery Tweetcycle 0.1
	http://zourbuth.com/plugins/tweetcycle
	Description: Display the the latest tweet in fade in/out mode
	License : MIT License / GPL License
*/

(function ($) {
    $.fn.tweetcycle = function (options) {

        var defaults = {
            username	: 'twitter',
            count		: 3
        }, selector;

        options  = $.extend(defaults, options);
        selector  = this;

        return this.each(function () {
			var twitterurl = "https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name="+options.username+"&count="+options.count+"&callback=?";
			$.getJSON(twitterurl, function (count) {
				$.each(count, function(i, tweet) {
					var text = tweet.text.linked().attributed().hashed();					
					$(selector).append('<p><span class="tweet-image">'+text+'&nbsp;<span class="tweet-time">'+tweet_time(tweet.created_at)+'</span></span></p>');					
				});
				$("p:first", selector).show();
			});

			String.prototype.hashed = function() {
				return this.replace(/#([A-Za-z0-9\/\.]*)/g, function(m) {
					return '<a target="_blank" href="http://twitter.com/search?q=' + m.replace('#','') + '">' + m + "</a>";
				});
			};

			String.prototype.linked = function(){
				return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
					return m.link(m);
				});
			};

			String.prototype.attributed = function() {
				return this.replace(/@[\w]+/g, function(m) {
					return '<a target="_blank" href="http://www.twitter.com/' + m.replace('@','') + '">' + m + "</a>";
				});
			}; 
		
			function tweet_time(time_value) {
				var values = time_value.split(" ");
				time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
				var parsed_date = Date.parse(time_value);
				var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
				var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
				delta = delta + (relative_to.getTimezoneOffset() * 60);
				var r = '';
				if (delta < 60)
					r = 'a minute ago';
				else if(delta < 120)
					r = 'couple of minutes ago';
				else if(delta < (45*60))
					r = (parseInt(delta / 60)).toString() + ' minutes ago';
				else if(delta < (90*60))
					r = 'an hour ago';
				else if(delta < (24*60*60))
					r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
				else if(delta < (48*60*60))
					r = '1 day ago';
				else
					r = time_value;
				return r;
			};
			
			// http://snook.ca/archives/javascript/simplest-jquery-slideshow
			setInterval(function(){$("p:first-child", selector).fadeOut("slow").next("p").fadeIn("slow").end().appendTo(selector);}, 4500);						
        });
    };
})(jQuery);