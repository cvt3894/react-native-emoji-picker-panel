/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry
} from 'react-native'
import EmojiPicker from 'react-native-emoji-picker-panel'
export default class emoji extends Component {
  _emojiSelected (emoji) {
    console.log(emoji)
  }

  render () {
    return (
      <EmojiPicker
        onEmojiSelected={this._emojiSelected.bind(this)} />
    )
  }
}

AppRegistry.registerComponent('emoji', () => emoji)
