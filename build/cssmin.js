module.exports = {
    all: {
        options: {
            inline: ['none'],
        },
        files: [
            {
                src: [
                    global.dist + '/css/common.css',
                    process.cwd() + '/node_modules/binary-style/binary.css',
                    process.cwd() + '/node_modules/binary-style/binary.more.css',
                ],
                dest: global.dist + '/css/common.min.css',
            },
            {
                expand: true,
                cwd   : global.dist + '/css',
                src   : ['fonts.css', 'app.css', 'static.css'],
                dest  : global.dist + '/css',
                ext   : '.min.css',
            },
        ],
    },
};
