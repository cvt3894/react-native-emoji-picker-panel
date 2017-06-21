'use strict'
import React, {
  PropTypes,
  Component
} from 'react'
import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import emoji from 'emoji-datasource'
import RenderTabBar from './RenderTabBar'
import _ from 'lodash'
import {
  groupBy,
  orderBy,
  includes
} from 'lodash/collection'
import {
  mapValues
} from 'lodash/object'
import 'string.fromcodepoint'

const { width } = Dimensions.get('window')
// i dont understand ANY of this but there's somethign called codepoints and surrogate pairs
// and this converts utf16 to a charachter in javascript. see more here:
// https://mathiasbynens.be/notes/javascript-unicode
// https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))
const charFromEmojiObj = obj => charFromUtf16(obj.unified)
const blacklistedEmojis = ['white_frowning_face', 'keycap_star', 'eject']

const isAndroid = Platform.OS === 'android'
const defaultEmojiSize = 40
const filteredEmojis = emoji.filter(e => isAndroid ? !!e.google : !includes(blacklistedEmojis, e.short_name))
// sort emojis by 'sort_order' then group them into categories
const groupedAndSorted = groupBy(orderBy(filteredEmojis, 'sort_order'), 'category')
// convert the emoji object to a character
const emojisByCategory = mapValues(groupedAndSorted, group => group.map(charFromEmojiObj))

const CATEGORIES = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags']

class EmojiPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      categories: CATEGORIES.slice(0, 1)
    }
  }

  componentWillUnmount () {
    clearTimeout(this._timeout)
  }

  loadNextCategory () {
    if (this.state.categories.length < CATEGORIES.length) {
      this.setState({ categories: CATEGORIES.slice(0, this.state.categories.length + 1) })
    }
  }

  renderCategory (category) {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <EmojiCategory
          {...this.props}
          key={category}
          category={category}
          finishedLoading={() => { this._timeout = setTimeout(this.loadNextCategory.bind(this), 100) }} />
      </View>
    )
  }

  render () {
    const { visible, style, tabViewProps } = this.props

    const tabs = [
      {
        tabLabel: '😃',
        category: 'People'
      },
      {
        tabLabel: '🐶',
        category: 'Nature'
      },
      {
        tabLabel: '🍔',
        category: 'Foods'
      },
      {
        tabLabel: '⚽',
        category: 'Activity'
      },
      {
        tabLabel: '🚌',
        category: 'Places'
      },
      {
        tabLabel: '💡',
        category: 'Objects'
      },
      {
        tabLabel: '💛',
        category: 'Symbols'
      },
      {
        tabLabel: '🏁',
        category: 'Flags'
      }
    ]

    return visible ? (
      <View style={[style || styles.container]}>
        <ScrollableTabView
          renderTabBar={() => <RenderTabBar />}
          {...tabViewProps}
        >
          {
            _.map(tabs, (tab, i) => (
              <ScrollView key={i} tabLabel={tab.tabLabel}>
                {this.renderCategory(tab.category)}
              </ScrollView>
            ))
          }
        </ScrollableTabView>
      </View>
    ) : null
  }
}

class EmojiCategory extends Component {
  componentDidMount () {
    this.props.finishedLoading()
  }

  render () {
    let emojis = emojisByCategory[this.props.category]
    let size = this.props.emojiSize || defaultEmojiSize
    let style = {
      fontSize: size - 14,
      color: 'black',
      height: size,
      width: width / this.props.itemPerRow,
      textAlign: 'center'
    }
    return (
      <View>
        <View style={styles.categoryInner}>
          {emojis.map(e =>
            <TouchableOpacity activeOpacity={0.7} key={e} onPress={() => this.props.onEmojiSelected(e)}>
              <Text style={style}>
                {e}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoryInner: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
})

EmojiPicker.propTypes = {
  visible: PropTypes.bool,
  emojiSize: PropTypes.number,
  onEmojiSelected: PropTypes.func.isRequired,
  tabViewProps: PropTypes.object,
  itemPerRow: PropTypes.number
}

EmojiPicker.defaultProps = {
  visible: true,
  itemPerRow: 7
}

export default EmojiPicker
