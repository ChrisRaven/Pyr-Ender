// ==UserScript==
// @name         Ender
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Allows quickly adding annotations at mouse pointer
// @author       Krzysztof Kruk
// @match        https://play.pyr.ai/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pyr.ai
// @updateURL    https://raw.githubusercontent.com/ChrisRaven/Pyr-Ender/main/Ender.user.js
// @downloadURL  https://raw.githubusercontent.com/ChrisRaven/Pyr-Ender/main/Ender.user.js
// @grant        none
// ==/UserScript==

/* global viewer */

(function() {
  'use strict'

  const color = 'white'

  document.addEventListener('mouseup', (e) => {
    if (e.button !== 1 && !(e.metaKey && e.button === 0)) return
    if (!e.target.classList.contains('neuroglancer-rendered-data-panel')) return

    function createAnnotation() {
      const annotations = annotationLayer.layer_.localAnnotations.toJSON()
      annotations.push({id: crypto.randomUUID(), point: Array.from(viewer.mouseState.position), type: 'point'})
      annotationLayer.layer_.localAnnotations.restoreState(annotations)
    }

    let annotationLayer = viewer.layerManager.getLayerByName('annotation')

    if (annotationLayer) {
      createAnnotation()
    }
    else {
      const currentLayersName = viewer.selectedLayer.layer_.name
      document.getElementsByClassName('neuroglancer-layer-add-button')[0].dispatchEvent(new MouseEvent("click", { ctrlKey: true }))
      annotationLayer = viewer.layerManager.getLayerByName('annotation')
      const element = [...document.querySelectorAll('.neuroglancer-layer-item-label')].find(el => el.textContent.trim() === currentLayersName)
      element.dispatchEvent(new MouseEvent('contextmenu', { button: 2, bubbles: true }))
      setTimeout(createAnnotation, 100)
    }

    annotationLayer.layer_.annotationDisplayState.color.restoreState(color)
  })

})()