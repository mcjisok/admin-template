<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#001529"
      text-color="#fff"
      router
      :collapse="collapsed"
      :unique-opened="true" 
      active-text-color="#2d8cf0">
      <template v-for="(item,index) in menuList">
        <template  v-if="item.children && item.children.length >= 1">
          <el-submenu :index="`/${item.name}`" :key="item.name" >
            <template slot="title">
              <common-icon :type="item.icon || ''"/>
              <span>{{item.meta.title}}</span>
            </template>
            <el-menu-item :index="`/${item.name}/${childrenItem.name}`" v-for="(childrenItem,childrenIndex) in item.children" :key="childrenItem.meta.title">{{childrenItem.meta.title}}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="`/${item.name}`" :key="item.name" >
            <i class="el-icon-setting"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>

    <!-- <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" @open="handleOpen" @close="handleClose" :collapse="collapsed" @select="handleSelect" :unique-opened="true"  >
      <div v-for="(item,index) in menuList" :key="index">
        <el-submenu :index="index.toString()" v-if="item.children && item.children.length >= 1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{item.meta.title}}</span>
          </template>
          <el-menu-item :index="`/${item.name}/${childrenItem.name}`" v-for="(childrenItem) in item.children" :key="childrenItem.name">
            <i class="el-icon-setting"></i>
            <span slot="title">{{childrenItem.meta.title}}</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item :index="`/${item.name}`" v-else >
          <i class="el-icon-menu"></i>
          <span slot="title">{{ showTitle(item) }} </span>
        </el-menu-item>
      </div>
    </el-menu> -->


    <!-- <el-menu ref="menu" router :collapse="collapsed"  :default-active="activeName" :default-openeds="openedNames" :unique-opened="true"   width="auto" @select="handleSelect" >
      <template v-for="item in menuList">
        <template v-if="item.children && item.children.length === 1">
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <el-menu-item v-else :name="getNameOrHref(item, true)" :index="`/${item.name}`" :key="`menu-${item.children[0].name}`"><common-icon :type="item.children[0].icon || ''"/><span>{{ showTitle(item.children[0]) }}</span></el-menu-item>
        </template>
        <template v-else>
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <el-menu-item v-else :name="getNameOrHref(item)" :index="`/${item.name}`" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''"/><span>{{ showTitle(item) }}</span></el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
        <el-tooltip transfer v-else :content="showTitle(item.children && item.children[0] ? item.children[0] : item)" placement="right" :key="`drop-menu-${item.name}`">
          <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/></a>
        </el-tooltip>
      </template>
    </div> -->
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue'
import CollapsedMenu from './collapsed-menu.vue'
import { getUnion } from '@/libs/tools'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  mixins: [ mixin ],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    }
  },
  methods: {
    handleSelect(key, keyPath){
      console.log('321')
    },
    handleOpen(key, keyPath){
    },
    handleClose(){},
    handleSelect (name) {
      this.$emit('on-select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  },
  computed: {
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
  watch: {
    activeName (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    },
    openNames (newNames) {
      this.openedNames = newNames
    },
    openedNames () {
      this.$nextTick(() => {
        // this.$refs.menu.select()
      })
    }
  },
  mounted () {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
  }
}
</script>
<style lang="less">

@import './side-menu.less';
</style>
