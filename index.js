'use strict';

const { dirname } = require('path');
const SVGSpriter    = require('svg-sprite'),
yaml                = require('js-yaml'),
path                = require('path'),
mkdirp              = require('mkdirp'),
fs                  = require('fs');

const config = {
    "svg": {
        "xmlDeclaration": false,
        "doctypeDeclaration": false,
        "namespaceIDs": false,
        "namespaceClassnames": false
    },
    "mode": {
        "symbol": {
            "dest": ".",
            "sprite": "line-awesome-icons.svg"
        }
    }
},
config_brands = {
    "svg": {
        "xmlDeclaration": false,
        "doctypeDeclaration": false,
        "namespaceIDs": false,
        "namespaceClassnames": false
    },
    "mode": {
        "symbol": {
            "dest": ".",
            "sprite": "line-awesome-brands.svg"
        }
    }
};


const yamlData  = yaml.load(fs.readFileSync(__dirname + '/brands.yaml', 'utf-8'));

const SVG_DIR   = __dirname + '/node_modules/line-awesome/svg/';
const files     = fs.readdirSync(SVG_DIR);

const spriter = new SVGSpriter(config),
spriter_brands= new SVGSpriter(config_brands);

// Register SVG files with the spriter
files.forEach(function (file) {
    if (yamlData.Brands.includes(file.replace('.svg',''))) {
        spriter_brands.add(
            path.resolve(SVG_DIR + file),
            file,
            fs.readFileSync(path.resolve(SVG_DIR + file), {encoding: 'utf-8'})
        );
    } else {
        spriter.add(
            path.resolve(SVG_DIR + file),
            file,
            fs.readFileSync(path.resolve(SVG_DIR + file), {encoding: 'utf-8'})
        );
    }
})

// Compile the sprites
spriter.compile(function(error, result, cssData) {
    // Run through all configured output modes
    for (var mode in result) {
        // Run through all created resources and write them to disk
        for (var type in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][type].path));
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
            cleanupSprite(result[mode][type].path);
        }
    }
});

spriter_brands.compile(function(error, result, cssData) {
    // Run through all configured output modes
    for (var mode in result) {
        // Run through all created resources and write them to disk
        for (var type in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][type].path));
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
            cleanupSprite(result[mode][type].path);
        }
    }
});


function cleanupSprite (spriteFile)
{
    var fileContent = fs.readFileSync(spriteFile, 'utf8');

    var result = fileContent.replaceAll(' xmlns="http://www.w3.org/2000/svg"', '')
                            .replaceAll(' xmlns:xlink="http://www.w3.org/1999/xlink"', '')
                            .replace('<svg>', '<svg xmlns="http://www.w3.org/2000/svg">');
    
    fs.writeFileSync(spriteFile, result, 'utf8');
}