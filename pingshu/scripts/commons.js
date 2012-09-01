// var s1 = '%{1} and %{2}!';
// console.log('source: ' + s1);
// console.log('target: ' + fmt(s1, 'ask', 'learn'));
//
// var s2 = "%{name} is %{age} years old, his son's name is %{sons[0].name}";
// console.log('source: ' + s2);
// console.log('target: ' + fmt(s2, { name: 'Lao Ming', age: 32, sons: [{ name: 'Xiao Ming' }]}));
function fmt() {
    var args = arguments;
    return args[0].replace(/%\{(.*?)}/g, function(match, prop) {
        return function(obj, props) {
            var prop = /\d+/.test(props[0]) ? parseInt(props[0]) : props[0];
            if (props.length > 1) {
                return arguments.callee(obj[prop], props.slice(1));
            } else {
                return obj[prop];
            }
        }(typeof args[1] === 'object' ? args[1] : args, prop.split(/\.|\[|\]\[|\]\./));
    });
}

function get_sql(key) {
    var pre = document.getElementById(key);
    return pre ? pre.innerHTML : null;
}

function tidy_html(html) {
    return html.replace(/[\s\S]*?<body>|<\/body>[\s\S]*|<script[\s\S]*?<\/script>|<img[\s\S]*?>/ig, '');
}

function is_empty(value) {
    switch(typeof(value)) {
        case 'string':
            return value && !/\s*/mg.test(value);
        default:
            return value;
        // TODO: 完善 is_empty() 方法，加入 map, list 支持
    }
}