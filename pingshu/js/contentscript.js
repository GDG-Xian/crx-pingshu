PATTERNS = {
    PLAYER_PAGE: /http\:\/\/.*\.5ips\.net\/car_(\d+)_(\d+)\.htm/ig,
    DOWN_LINK: /<li>下载方式一（普通下载）：<a href=\"(.*?)\">/ig
};

TPLS = {
    AUDIO: '<audio id="pingshu-player" autoplay="autoplay" controls="controls" src="%{1}"></audio>'
};

var $toolbar, $player;

function dispatcher(url) {
    if (PATTERNS.PLAYER_PAGE.test(url)) {
        player_page_handler({
            album_id: RegExp.$1,
            track_id: RegExp.$2,
            url: url
        });
    }   
}

function player_page_handler(detail) {
    var down_url = detail.url.replace('/car_', '/down_');
    $.get(down_url, function(html) {
        var match = PATTERNS.DOWN_LINK.exec(html);
        var mp3_url = match && match[1];
        console.log(mp3_url);
        
        // 初始化播放器
        $player = $(fmt(TPLS.AUDIO, encodeURI(mp3_url)));
        $('#czplayer').parent().css('background-image', 'none').empty().append($player);
    }).error(function(xhr, textStatus, error) {
        console.error(error);
    });
}

function get_mp3_url(url) {
    var dl_url = url.replace('/car_', '/down_');
}

$(function() {
    // 添加顶部工具条
    $toolbar = $('<div id="pingshu-toolbar">听评书 V1.0</div>');
    $toolbar.appendTo($(document.body));

    dispatcher(location.toString());
});
