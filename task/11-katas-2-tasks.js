'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount( bankAccount ) {
    const digitMap = {
            ' _ | ||_|': 0,
            '     |  |': 1,
            ' _  _||_ ': 2,
            ' _  _| _|': 3,
            '   |_|  |': 4,
            ' _ |_  _|': 5,
            ' _ |_ |_|': 6,
            ' _   |  |': 7,
            ' _ |_||_|': 8,
            ' _ |_| _|': 9
        },
        digitChunks = bankAccount.split( '\n' )
        .map( el => el.match( /.{3}/g ) );

    return digitChunks[ 0 ].reduce(
        function ( result, el, i ) {
            const digitStr = el + digitChunks[ 1 ][ i ] + digitChunks[ 2 ][ i ];
            if ( !( digitStr in digitMap ) )
                throw new Error( 'Unrecognized number.' );

            return result * 10 + digitMap[ digitStr ];
        },
        0
    );
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText( text, columns ) {
    const reg = new RegExp( '(?!\\s)(.{1,' + columns + '})(?=\\s|$)', 'g' );

    let textChunk;

    while ( textChunk = reg.exec( text ) ) {
        yield textChunk[ 0 ];
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank( hand ) {
    const allRanks = '234567891JQKA',

        handRanks = hand.map( el => el.charAt( 0 ) )
        .sort( ( a, b ) => allRanks.indexOf( a ) - allRanks.indexOf( b ) ),

        handSuits = hand.map( el => el.charAt( el.length - 1 ) ),

        isFlush = checkFlush( handSuits ),
        isStraight = checkStraight( handRanks );

    if ( isFlush && isStraight )
        return PokerRank.StraightFlush;

    const groupedHandRanks = handRanks.join( '' )
        .match( /((.)\2{0,3})/g );

    if ( groupedHandRanks.some( el => el.length === 4 ) )
        return PokerRank.FourOfKind;

    if ( groupedHandRanks[ 0 ].length + groupedHandRanks[ 1 ].length === 5 )
        return PokerRank.FullHouse;

    if ( isFlush )
        return PokerRank.Flush;

    if ( isStraight )
        return PokerRank.Straight;

    if ( groupedHandRanks.some( el => el.length === 3 ) )
        return PokerRank.ThreeOfKind;

    const pairCount = groupedHandRanks.reduce( ( count, el ) => count + ( el.length === 2 ), 0 );

    if ( pairCount === 2 )
        return PokerRank.TwoPairs;

    if ( pairCount )
        return PokerRank.OnePair;

    return PokerRank.HighCard;



    function checkFlush( suits ) {
        return Array.from( new Set( suits ) )
            .length === 1;
    }

    function checkStraight( ranks ) {
        if ( allRanks.indexOf( ranks.join( '' ) ) > -1 || ranks.join( '' ) === '2345A' )
            return true;

        return false;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles( figure ) {
    const figureRows = figure.split( '\n' );

    // fix \n at the end of figure
    if ( figureRows[ figureRows.length - 1 ] === '' ) figureRows.pop();

    const figureArr = figureRows.map( el => el.split( '' ) );

    let figureColls = Array.from( {
            length: figureRows[ 0 ].length
        }, () => '' ),

        row, coll,
        plusesPos = [];

    for ( row = 0; row < figureArr.length; row++ ) {
        for ( coll = 0; coll < figureArr[ row ].length; coll++ ) {
            const char = figureArr[ row ][ coll ];

            figureColls[ coll ] += char;

            if ( char === '+' )
                plusesPos.push( {
                    row,
                    coll
                } );
        }
    }

    let i;
    for ( i = 0; i < plusesPos.length; i++ ) {
        const res = findRect( plusesPos[ i ].row, plusesPos[ i ].coll );

        if ( res )
            yield * drawRect( res );
    }

    function findRect( topRow, leftColl ) {
        let topLine = findInRow( topRow, leftColl ),
            leftLine = findInColl( leftColl, topRow );

        while ( topLine && leftLine ) {
            const rightColl = leftColl + topLine.length - 1,
                bottomRow = topRow + leftLine.length - 1;

            const rightLine = figureColls[ rightColl ].slice( topRow, bottomRow + 1 ),
                bottomLine = figureRows[ bottomRow ].slice( leftColl, rightColl + 1 );

            if ( !checkColl( rightLine ) ) {
                const topAddition = findInRow( topRow, rightColl );

                if ( !topAddition ) break;
                topLine += topAddition.slice( 1 );
            } else if ( !checkRow( bottomLine ) ) {
                const leftAddition = findInColl( leftColl, bottomRow );

                if ( !leftAddition ) break;
                leftLine += leftAddition.slice( 1 );
            } else
                return {
                    width: topLine.length,
                    height: leftLine.length
                };
        }

        return false;

        function findInRow( rowN, startIndex ) {
            const result = figureRows[ rowN ].slice( startIndex )
                .match( /^\+-*?\+/ );

            return result && result[ 0 ];
        }

        function findInColl( collN, startIndex ) {
            const result = figureColls[ collN ].slice( startIndex )
                .match( /^\+\|*?\+/ );

            return result && result[ 0 ];
        }

        function checkRow( str ) {
            return /^\+[-\+]*\+$/.test( str );
        }

        function checkColl( str ) {
            return /^\+[\|\+]*\+$/.test( str );
        }
    }

    function* drawRect( options ) {
        const innerW = options.width - 2,
            innerH = options.height - 2;

        let rectangle = `+${'-'.repeat(innerW)}+\n`;

        rectangle += `|${' '.repeat(innerW)}|\n`.repeat( innerH );
        rectangle += `+${'-'.repeat(innerW)}+\n`;

        yield rectangle;
    }
}


module.exports = {
    parseBankAccount: parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};