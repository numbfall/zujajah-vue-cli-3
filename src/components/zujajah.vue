<template>
  <div class="hello">
    <div class="ui grid">
      <div class="six wide column">
        <div class="ui vertical menu fluid">
          <div class="item"><strong>Categories</strong></div>
          <div class="ui left pointing dropdown link item" v-dropdown v-for="(cat, index) in category.Categories" :key="index">
            {{cat.Title}}<i class="dropdown icon"></i>
            <div class="menu">
                <div class="item" v-for="(subCat, index) in cat.Subcategories" :key="index" v-on:click="showCourses(subCat.Category, index)">{{subCat.Title}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ten wide column">
        <div class="ui vertical menu fluid">
          <div class="item"><div v-show="courses.length == 0" class="ui red horizontal label">Select a category</div><strong>Courses</strong></div>
          <div class="ui dropdown item" v-for="(crs, index) in courses" :key="index" :value="crs.Keyword" v-on:click="getCourse(crs.Keyword)">{{crs.Title}}</div>
        </div>
      </div>
    </div>
    <div class="ui grid">
      <div v-if="course.length != 0" class="sixteen wide column">
        <div class="ui label large">{{course.Course.Title}}</div>
          <div class="ui accordion fluid styled" v-accordion>
            <div v-for="(top, index) in course.Course.Topic" :key="index">
              <div class="title"><i class="dropdown icon"></i>{{top.Title}}</div>
              <div class="content">
                <div class="ui accordion styled" v-for="(les, index) in top.Lesson" :key="index">
                  <div class="title">{{les.Title}}</div>
                  <div class="content">
                    <div class="ui relaxed divided list selection">
                      <div class="item" v-for="(res, index) in les.Resource" :key="index" v-on:click="loadAudio(res.DownloadLocation)">
                        <i class="play icon large"></i>
                        <div class="content">
                          <div class="header">{{res.Title}}</div>
                          <div class="description">Duration: {{res.Duration}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="ui grid">
      <div class="ten wide column">
        <audio controls><source :src="resource"></audio>
      </div>
    </div>
    <ul v-if="errors && errors.length">
      <li v-for="error of errors" :key='error'>
        {{error.message}}
      </li>
    </ul>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'

export default {
  name: 'zujajah',
  data () {
    return {
      category: [],
      courses: [],
      course: [],
      resource: '',
      errors: []
    }
  },

  created () {
    axios.get('/resources/categories.json')
      .then(response => {
        this.category = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },

  methods: {
    loadAudio: function (res) {
      this.resource = 'http://alhudamedia.com/' + res
    },
    getCourse: function (val) {
      axios.get('/resources/xmls/' + val + '.json')
        .then(response => {
          this.course = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    showCourses: function (cat, ind) {
      this.courses = this.category.Categories[cat].Subcategories[ind].Courses
    }
  },

  watch: {
    resource: (url) => {
      $('audio')[0].load(url)
      $('audio')[0].play()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

.debug div {
  border: 1px solid lightgoldenrodyellow;
}

.main {
  max-width: 950px;
  margin: 0 auto;
  text-align: left;
}

audio {
  position: fixed;
  bottom: 0;
  right: 0;
  min-width: 30em;
}

i.icon.play.large {
  padding-top: 0.5em;
}

</style>
