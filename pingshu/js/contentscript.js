// 当前地址、下一回地址、下载地址
var curr_url, next_url, down_url;

PATTERNS = {
    PLAYER_PAGE: /http\:\/\/.*\.5ips\.net\/car_(\d+)_(\d+)\.htm/ig,
    DOWN_LINK: /<li>下载方式一（普通下载）：<a href=\"(.*?)\">/ig,
    NEXT_LINK: /<a.*href=\"(\/car_\d+_\d+\.htm)\".*>下一回<\/a>/ig
};

TPLS = {
    AUDIO: '<audio id="pingshu-player" autoplay="autoplay" controls="controls"></audio>'
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
    // 获取下一回的链接
    var match_next = PATTERNS.NEXT_LINK.exec(document.body.innerHTML);
    next_url = match_next && match_next[1];
    next_url = next_url && encodeURI(curr_url.replace(/(\/car_\d+_\d+\.htm)/ig, next_url));
    console.log('next_url', next_url);

    down_url = detail.url.replace('/car_', '/down_');
    $.get(down_url, function(html) {
        var match = PATTERNS.DOWN_LINK.exec(html);
        var mp3_url = match && encodeURI(match[1]);
        console.log(mp3_url);

        // 初始化播放器
        $player_container = $('#czplayer');
        $player_container.css('background-image', 'none');
        $player_container.html(TPLS.AUDIO);

        // 初始化播放事件并开始播放评书
        $player = $('#pingshu-player');
        if (next_url) {
            $player.on('ended', function() {
                console.log('Navigate to next:', next_url);
                window.location = next_url; 
            }); 
        }
        $player.attr('src', mp3_url);
    }).error(function(xhr, textStatus, error) {
        console.error(error);
    });
}

$(function() {
    curr_url = location.toString();

    // 添加顶部工具条
    $toolbar = $('<div id="pingshu-toolbar">听评书 V1.0</div>');
    $toolbar.appendTo($(document.body));

    dispatcher(curr_url);
});
