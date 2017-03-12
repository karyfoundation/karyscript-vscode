
//
// Gerda File Scanner ( For suggesting functions and stored spaces );
// Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import fs   = require( 'fs' );
    import path = require( 'path' );

//
// ─── RESULT INTERFACE ───────────────────────────────────────────────────────────
//

    export interface IFileSuggestionResults {
        suggestion: string;
        documentation: string;
    }

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    const arendelleNameRegex = /^[a-zA-Z0-9 \_]+$/;

//
// ─── PROVIDER FOR FUNCTIONS ─────────────────────────────────────────────────────
//

    export function getArendelleFunctionsFrom ( dir: string ): IFileSuggestionResults[ ] {
        return scanDir( dir, '.arendelle' );
    }

//
// ─── PROVIDER FOR STORED SPACES ─────────────────────────────────────────────────
//

    export function getArendelleStoredSpacesFrom ( dir: string ): IFileSuggestionResults[ ] {
        return scanDir( dir, '.space' );
    }

//
// ─── GET FILE WITHOUT FILE TYPE ─────────────────────────────────────────────────
//

    function getFileWithoutFileType ( file: string, fileType: string ): string {
        return file.substring( 0, file.length - fileType.length );
    }

//
// ─── READ DOCUMENTATION FOR FILE ────────────────────────────────────────────────
//

    function getDocumentationForFile ( file: string, dir: string ) {
        let docFileName = path.join( dir, `${ file }.comment` );
        if ( fs.existsSync( docFileName ) ) {
            try {
                return fs.readFileSync( docFileName, 'utf8' );
            } catch ( e ) {
                return null;
            }
        } else {
            return null;
        }
    }

//
// ─── FILE SCANNER ───────────────────────────────────────────────────────────────
//

    function scanDir ( dir: string, fileType: string ): IFileSuggestionResults[ ] {
        let results = new Array<IFileSuggestionResults> ( );
        fs.readdirSync( dir ).map( file => {
            try {
                let address = path.join( dir, file );
                let status = fs.statSync( address );
                if ( status.isDirectory( ) ) {
                    if ( arendelleNameRegex.test( file ) ) {
                        // going for the subdirectory....
                        scanDir( address, fileType ).map( item => {
                            results.push({
                                suggestion: `${ file }.${ item.suggestion }`,
                                documentation: item.documentation
                            });
                        });
                    }
                } else {
                    // is our file an Arendelle file?
                    if ( file.endsWith( fileType ) ) {
                        let name = getFileWithoutFileType( file, fileType );
                        if ( arendelleNameRegex.test( name ) ) {
                            results.push({
                                suggestion: name,
                                documentation: getDocumentationForFile( name, dir )
                            });
                        }
                    }
                }
            } catch ( error ) {
                console.log( error );
            }
        });
        return results;
    }

// ────────────────────────────────────────────────────────────────────────────────

