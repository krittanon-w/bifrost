import Vue from 'vue'

const getLocalStorage = async (key, defaultValue) => {
  return new Promise(resolve => {
    if (chrome.storage) {
      chrome.storage.local.get([key], (results) => {
        resolve(results[key] || defaultValue)
      })
    }
    else {
      resolve(null)
    }
  })
}

const setLocalStorage = async (key, value) => {
  return new Promise(resolve => {
    if (chrome.storage) {
      chrome.storage.local.set({[key]: value}, () => {
        resolve(null)
      })
    }
    else {
      resolve(null)
    }
  })
}

Vue.prototype.$getLocalStorage = getLocalStorage
Vue.prototype.$setLocalStorage = setLocalStorage
