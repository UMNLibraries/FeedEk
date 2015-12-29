/*
* FeedEk jQuery RSS/ATOM Feed Plugin v2.0
* http://jquery-plugins.net/FeedEk/FeedEk.html  https://github.com/enginkizil/FeedEk
* Author : Engin KIZIL http://www.enginkizil.com
* Modifications by gormsby@umn.edui to address the following needs:
* - Requesting feeds over https to avoid mixed content warnings/blocks.
* - Breaking summary on word boundary after
*   http://jquery-plugins.net/FeedEk/FeedEk.html#comment-1324823216.
* - Changing format of html output to correspond to our home page needs.
*/

(function ($) {
  $.fn.FeedEk = function (opt) {

    var def = $.extend({
      FeedUrl: "https://www.lib.umn.edu/continuumfeed",
      MaxCount: 5,
      ShowDesc: true,
      ShowPubDate: true,
      CharacterLimit: 0,
      TitleLinkTarget: "_blank",
      DateFormat: "",
      DateFormatLang:"en"
    }, opt);

    var id = $(this).attr("id");
    $("#" + id).empty().append('<i class="icon-spin"></i>');

    var handlePhpError = function(response_text) {
      var json_string = response_text.substring(4, response_text.indexOf('}]);'));
      json_string += '}]';
      return json_string;
    }

    var newsItemHtml = function(item) {
      var html;

      html =
        '<li class="list-group-item"><a href="' + item.permalink + '" target="' + def.TitleLinkTarget + '" >' + item.title + "</a></li>";

      return html;
    }

    $.ajax({
      // Continuum data feed
      url: def.FeedUrl,
      // The name of the callback parameter
      jsonpCallback: "foo",
      // Tell jQuery we're expecting JSONP
      dataType: "jsonp",
      // Cache it
      cache: true,

      // Work with the response
      success: function(data) {
        var news = new Array();
        for (var i = 0; i < def.MaxCount; i++) {
          news.push(newsItemHtml(data.responseData[i]));
        };

        if(news.length) {
          $("#" + id).append(
            '<ul class="list-group margin-top" style="padding-bottom:0px;margin-bottom:8px">' + news.join('') + "</ul>"
          );
        }
      },

      // Handle error
      error: function(response, error) {
        // Expecting an error, due to PHP error within
        // the WordPress Feed JSON output
        var response_text,json_string,data,news;
        response_text = response.responseText;
        json_string = handlePhpError(response_text);

        try {
          data = JSON.parse(json_string);
          var news = new Array();
          for (var i = 0; i < def.MaxCount; i++) {
            news.push(newsItemHtml(data[i]));
          };

          if(news.length) {
            $("#" + id).append(news.join(''));
          }
        }
        catch(e) {
          console.log(e);
        }
      }
    });

}})(jQuery);
