
//
// Gerda Adaptor for Visual Studio Code
// Copyright 2016 Kary Foundation, Inc.
//    Author: Pouya Kary <k@karyfoundation.org>
//


//
// ──────────────────────────────────────────────── I ──────────
//  :::::: D E F S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import * as vscode from 'vscode';
    import * as GerdaSpaceScanner from './gerda-spaces';
    import * as GerdaFilesScanner from './gerda-files';

//
// ─── COUNT GLOBAL POSITION ──────────────────────────────────────────────────────
//

    function countGlobalPosition ( document: vscode.TextDocument, position: vscode.Position ): number {
        let globalPosition = 0;
        for ( let iteration = 0; iteration < position.line; iteration++ ) {
            globalPosition += 1 + vscode.window.activeTextEditor.document.lineAt( iteration ).range.end.character;
        }
        return globalPosition + position.character;
    }

//
// ─── CREATE COMPLETION ITEM ─────────────────────────────────────────────────────
//

    function createCompletionItemForSpace ( name: string ): vscode.CompletionItem {
        let item = new vscode.CompletionItem( name );
        item.kind = vscode.CompletionItemKind.Variable;
        item.detail = 'Space';
        return item;
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────── II ──────────
//  :::::: M A I N : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

//
// ─── ACTIVATION ─────────────────────────────────────────────────────────────────
//

    export function activate ( context: vscode.ExtensionContext ) {

        //
        // ─── SPACES ──────────────────────────────────────────────────────
        //

            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider(
                    'arendelle', arendelleSpaceCompletionProvider, '@'
                )
            );

        //
        // ─── SOURCES ─────────────────────────────────────────────────────
        //

            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider(
                    'arendelle', arendelleSourceCompletionProvider, '#'
                )
            );

        //
        // ─── FUNCTIONS ───────────────────────────────────────────────────
        //

            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider(
                    'arendelle', arendelleFunctionCompletionProvider, '!'
                )
            );

        //
        // ─── STORED SPACES ───────────────────────────────────────────────
        //

            context.subscriptions.push(
                vscode.languages.registerCompletionItemProvider(
                    'arendelle', arendelleStoredSpaceCompletionProvider, '$'
                )
            );

        // ─────────────────────────────────────────────────────────────────

    }

//
// ─── DEACTIVATE ─────────────────────────────────────────────────────────────────
//

    export function deactivate ( ) { }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────────────────── III ──────────
//  :::::: S P A C E   C O M P L E T I O N : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────
//

//
// ─── PROVIDER IMPLEMENTATIONS ───────────────────────────────────────────────────
//

    let arendelleSpaceCompletionProvider: vscode.CompletionItemProvider = {

        //
        // ─── PROVIDER ────────────────────────────────────────────────────
        //

            provideCompletionItems: ( document: vscode.TextDocument,
                                       position: vscode.Position,
                                       token: vscode.CancellationToken ):
                                       vscode.CompletionItem[ ] => {

                // global position
                let globalPosition = countGlobalPosition( document, position );

                // text:
                let text = document.getText( new vscode.Range(
                    new vscode.Position( 0, 0 ),
                    position
                ));

                // computing the code....
                let spaces = GerdaSpaceScanner.Gerda.Kernel.GetSpaces(
                    text, globalPosition
                );

                // returning completion items...
                return spaces.map( space => createCompletionItemForSpace( space ) );
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────────────────────── IV ──────────
//  :::::: R E S O U R E   C O M P L E T I O N : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
//

//
// ─── SOURCE COMPLETION ITEM GENERATOR ───────────────────────────────────────────
//

    function createCompletionItemForSource ( name: string ): vscode.CompletionItem {
        let item = new vscode.CompletionItem( name );
        item.kind = vscode.CompletionItemKind.Method;
        item.detail = 'Source';
        return item;
    }

//
// ─── PROVIDER IMPLEMENTATIONS ───────────────────────────────────────────────────
//

    let arendelleSourceCompletionProvider: vscode.CompletionItemProvider = {

        //
        // ─── PROVIDER ────────────────────────────────────────────────────
        //

            provideCompletionItems: ( document: vscode.TextDocument,
                                      position: vscode.Position,
                                      token: vscode.CancellationToken ):
                                      vscode.CompletionItem[ ] => {

                return [
                    'rnd' , 'x' , 'y' , 'i' , 'j' , 'width' , 'height' , 'pi' , 'time'
                ].map(
                    source => createCompletionItemForSource( source )
                );
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ────────────────────────────────────────────────────────────────────────────── V ──────────
//  :::::: F U N C T I O N   C O M P L E T I O N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//

//
// ─── SOURCE COMPLETION ITEM GENERATOR ───────────────────────────────────────────
//

    function createCompletionItemForFunction ( suggestion: GerdaFilesScanner.IFileSuggestionResults ): vscode.CompletionItem {
        let item = new vscode.CompletionItem( suggestion.suggestion );
        item.kind = vscode.CompletionItemKind.Function;
        item.detail = 'Function';
        if ( suggestion.documentation != null ) {
            item.documentation = suggestion.documentation;
        }
        return item;
    }

//
// ─── PROVIDER IMPLEMENTATIONS ───────────────────────────────────────────────────
//

    let arendelleFunctionCompletionProvider: vscode.CompletionItemProvider = {

        //
        // ─── PROVIDER ────────────────────────────────────────────────────
        //

            provideCompletionItems: ( document: vscode.TextDocument,
                                      position: vscode.Position,
                                      token: vscode.CancellationToken ):
                                      vscode.CompletionItem[ ] => {

                return GerdaFilesScanner.getArendelleFunctionsFrom(
                    vscode.workspace.rootPath
                ).map( func => {
                    return createCompletionItemForFunction( func );
                });
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ────────────────────────────────────────────────────────────────────────────────────── VI ──────────
//  :::::: S T O R E D   S P A C E   C O M P L E T I O N : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────
//

//
// ─── SOURCE COMPLETION ITEM GENERATOR ───────────────────────────────────────────
//

    function createCompletionItemForStoredSpace ( suggestion: GerdaFilesScanner.IFileSuggestionResults ): vscode.CompletionItem {
        let item = new vscode.CompletionItem( suggestion.suggestion );
        item.kind = vscode.CompletionItemKind.File;
        item.detail = 'Stored Space';
        if ( item.documentation != null ) {
            item.documentation = suggestion.documentation;
        }
        return item;
    }

//
// ─── PROVIDER IMPLEMENTATIONS ───────────────────────────────────────────────────
//

    let arendelleStoredSpaceCompletionProvider: vscode.CompletionItemProvider = {

        //
        // ─── PROVIDER ────────────────────────────────────────────────────
        //

            provideCompletionItems: ( document: vscode.TextDocument,
                                      position: vscode.Position,
                                      token: vscode.CancellationToken ):
                                      vscode.CompletionItem[ ] => {

                return GerdaFilesScanner.getArendelleStoredSpacesFrom(
                    vscode.workspace.rootPath
                ).map( storedSpace => {
                    return createCompletionItemForStoredSpace( storedSpace );
                });
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────