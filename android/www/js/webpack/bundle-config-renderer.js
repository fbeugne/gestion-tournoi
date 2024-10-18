/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./www/js/config-renderer.js":
/*!***********************************!*\
  !*** ./www/js/config-renderer.js ***!
  \***********************************/
/***/ (() => {

eval("var initConfig = function initConfig() {\n  if (window.tournoi.config.getConfig() === undefined) {\n    window.tournoi.config.loadConfig(window.localStorage.getItem('configTournoi'));\n  }\n};\nvar saveConfig = function saveConfig() {\n  window.localStorage.setItem('configTournoi', window.tournoi.config.getConfig());\n};\n\n/*********************************************************/\n/*               Config du nombre de parties             */\n/*********************************************************/\n// Fonction pour mettre à jour le nombre de parties\nvar initNbRounds = function initNbRounds() {\n  var nbRounds = window.tournoi.config.getNbRounds();\n  document.getElementById(\"config_nb_parties\").value = nbRounds;\n\n  // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur\n  document.getElementById(\"config_nb_parties\").addEventListener('change', updateNbRounds);\n};\n\n// Fonction pour mettre à jour le nombre de parties\nvar updateNbRounds = function updateNbRounds() {\n  var nbRounds = document.getElementById(\"config_nb_parties\").value;\n  window.tournoi.config.setNbRounds(nbRounds);\n  saveConfig();\n};\n\n/*********************************************************/\n/*               Config du nombre de joueurs             */\n/*********************************************************/\n\n// Fonction pour mettre à jour le nombre de joueur\nvar initNbPlayers = function initNbPlayers() {\n  var nbPlayers = window.tournoi.config.getNbPlayersPerTeam();\n  document.getElementById(\"config_nb_joueurs\").value = nbPlayers;\n\n  // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur\n  document.getElementById(\"config_nb_joueurs\").addEventListener('change', updateNbPlayers);\n};\n\n// Fonction pour mettre à jour le nombre de joueur\nvar updateNbPlayers = function updateNbPlayers() {\n  var nbPlayers = document.getElementById(\"config_nb_joueurs\").value;\n  window.tournoi.config.setNbPlayersPerTeam(nbPlayers);\n  saveConfig();\n};\n\n/*********************************************************/\n/*               Config de la liste des joueurs          */\n/*********************************************************/\n\n// Afficher la liste des personnes \nvar renderList = function renderList() {\n  var textarea = document.getElementById(\"personList\");\n  personList = window.tournoi.config.getPlayers();\n  textarea.value = \"\";\n  personList.forEach(function (person) {\n    textarea.value += person.name;\n    textarea.value += \"\\n\";\n  });\n\n  // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur\n  document.getElementById(\"personList\").addEventListener('keyup', parsePersonList);\n};\nvar parsePersonList = function parsePersonList() {\n  var textarea = document.getElementById(\"personList\");\n  var personArray = textarea.value.split(\"\\n\") // Sépare chaque ligne\n  .map(function (name) {\n    return name.trim();\n  }) // Supprime les espaces inutiles\n  .filter(function (name) {\n    return name !== \"\";\n  }); // Ignore les lignes vides\n\n  var playersList = [];\n  personArray.forEach(function (person) {\n    playersList.push({\n      name: person\n    });\n  });\n  window.tournoi.config.updatePlayers(playersList);\n  saveConfig();\n};\nvar initConfigRenderer = function initConfigRenderer() {\n  initConfig();\n  initNbRounds();\n  initNbPlayers();\n  // Afficher la liste initiale\n  renderList();\n};\n\n//# sourceURL=webpack://lancement-gestion-tournoi/./www/js/config-renderer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./www/js/config-renderer.js"]();
/******/ 	
/******/ })()
;