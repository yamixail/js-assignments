'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle( puzzle, searchStr ) {
    const puzzleArr = puzzle.map( el => el.split( '' ) ),
        getLettersAround = [ getTopLetter, getRightLetter, getBottomLetter, getLeftLetter ],
        firstChar = searchStr.charAt( 0 );

    let row, coll;

    for ( row = 0; row < puzzleArr.length; row++ ) {
        for ( coll = 0; coll < puzzleArr[ row ].length; coll++ ) {

            if ( puzzleArr[ row ][ coll ] === firstChar &&
                snakeFind( row, coll, searchStr.slice( 1 ), [ [ row, coll ] ] ) )
                return true;

        }
    }

    return false;

    function snakeFind( row, coll, searchStr, blockedCells ) {
        if ( !searchStr.length ) return true;

        let i,
            findLetter = searchStr.charAt( 0 );

        const lettersAround = getLettersAround.map( fn => fn.call( null, row, coll ) )
            .filter( el => el !== null && el.letter === findLetter )
            .filter(
                el => blockedCells.every(
                    blockedCell => blockedCell[ 0 ] !== el.row || blockedCell[ 1 ] !== el.coll
                )
            );


        for ( i = 0; i < lettersAround.length; i++ ) {
            const r = lettersAround[ i ].row,
                c = lettersAround[ i ].coll;

            blockedCells.push( [ r, c ] );

            if ( snakeFind( r, c, searchStr.slice( 1 ), blockedCells ) )
                return true;

            blockedCells.pop();
        }

        return false;
    }

    function getTopLetter( row, coll ) {
        if ( !puzzleArr[ --row ] ) return null;

        return getLetterObj( row, coll );
    }

    function getRightLetter( row, coll ) {
        if ( !puzzleArr[ row ][ ++coll ] ) return null;

        return getLetterObj( row, coll );
    }

    function getBottomLetter( row, coll ) {
        if ( !puzzleArr[ ++row ] ) return null;

        return getLetterObj( row, coll );
    }

    function getLeftLetter( row, coll ) {
        if ( !puzzleArr[ row ][ --coll ] ) return null;

        return getLetterObj( row, coll );
    }

    function getLetterObj( row, coll ) {
        return {
            letter: puzzleArr[ row ][ coll ],
            row,
            coll
        };
    }
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations( chars ) {
    let i,
        mutation = ( arguments.length > 1 ) ? arguments[ 1 ] : '';

    if ( chars.length === 0 )
        yield mutation;

    for ( i = 0; i < chars.length; i++ ) {
        const char = chars.charAt( i );

        mutation += char;
        chars = chars.slice( 0, i ) + chars.slice( i + 1 );

        yield * getPermutations( chars, mutation );

        mutation = mutation.slice( 0, mutation.length - 1 );
        chars = chars.slice( 0, i ) + char + chars.slice( i );
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes( quotes ) {
    let i,
        buyPositions = [],
        profit = 0;

    for ( i = 0; i < quotes.length; i++ ) {
        const price = quotes[ i ],
            nextMaxPrice = Math.max.apply( Math, quotes.slice( i + 1 ) );

        if ( price < nextMaxPrice )
            buyPositions.push( price );
        else if ( buyPositions.length ) {
            profit += buyPositions.reduce( ( summ, buyPrice ) => summ + ( price - buyPrice ), 0 );
            buyPositions = [];
        }
    }

    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    // 'IJKLM' =>
    // ['I', 'J', 'K', 'L', 'M'] => 
    // [ '08', '09', '10', '11', '12'] =>
    // ['0809', '1011', '12'] =>
    // pack two letters in one byte by String.fromCodePoint
    encode: function ( url ) {
        const codeArr = Array.from( url )
            .map( letter => this.getXXPosition( letter ) );

        const compressedCodes = codeArr.reduce(
            function ( result, code ) {
                var lastCode = result[ result.length - 1 ];

                if ( lastCode.length > 2 )
                    result.push( code );
                else
                    result[ result.length - 1 ] += code;

                return result;
            }, [ '' ]
        );

        return String.fromCodePoint.apply( String, compressedCodes );
    },

    getXXPosition: function ( char ) {
        let index = this.urlAllowedChars.indexOf( char );

        if ( index === -1 ) throw new Error( `Disallowed char "${char}"` );

        if ( index > 9 ) return index.toString();

        return '0' + index;
    },

    decode: function ( code ) {
        const compressedCodes = Array.from( code )
            .map( char => char.codePointAt( 0 )
                .toString() );

        const codeArr = compressedCodes.reduce(
            function ( result, code ) {
                if ( code.length % 2 ) code = '0' + code;

                return result.concat( code.toString()
                    .match( /.{2}/g ) );
            }, []
        );

        return codeArr.map( position => this.getCharByPosition( position ) )
            .join( '' );
    },

    getCharByPosition: function ( position ) {
        const char = this.urlAllowedChars[ parseInt( position ) ];

        if ( !char ) throw new Error( `Invalid code.` );

        return char;
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};