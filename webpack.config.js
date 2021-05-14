const path = require('path');
const MiniCssExtartcPlugin = require('mini-css-extract-plugin');
module.exports = {
    //0. Establecer el modo del congigurador 
    mode: 'development',
    //1. Especificando er archivo de entrada
    entry: './client/index.js',
    //2. Especificar la salida 
    output:{
        //3. Ruta absoluta de salida
        path: path.join(__dirname, 'public'),
        //4. Nombre del archivo de salida 
        filename: 'js/bundle.js',
        //5. Ruta del path publica para fines del servidor de desarrollo 
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        'modules': false,
                                        'useBuiltIns': 'usage',
                                        'targets': {"chrome": "80"},
                                        'corejs': 3
                                    }
                                ]
                            ],
                            "plugins": [
                                [
                                    "module-resolver",
                                    {
                                        "root": ["./"],
                                        "alias":{
                                            "@client" : "./client"
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtartcPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtartcPlugin({
            filename: 'styles/app.css'
        })
    ]
}