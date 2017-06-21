import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native'

const FacebookTabBar = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  render () {
    const tabUnderlineStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: '#007aff',
      bottom: 0
    }
    const tabLineStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: 'rgba(0,0,0,0.05)',
      bottom: 0
    }
    return <View style={[styles.tabs, this.props.style]}>
      {this.props.tabs.map((tab, i) => {
        return (
          <TouchableOpacity activeOpacity={0.7} key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
            <Text style={styles.text}>{tab}</Text>
            {this.props.activeTab === i ? <View style={tabUnderlineStyle} /> : <View style={tabLineStyle} />}
          </TouchableOpacity>
        )
      })}
    </View>
  }
})

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5
  },
  text: {
    fontSize: 20,
    color: 'black'
  }
})

export default FacebookTabBar
