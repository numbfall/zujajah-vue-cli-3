<template>
<div class="main">
  <div class="ui stackable grid">
    <div class="four wide column">
      <div class="ui vertical menu">
        <div class="item" v-for="(cat, index) in category.Categories" :key="index">
          <div class="header">{{cat.Title}}</div>
          <div class="menu">
            <a class="item link" v-for="(subCat, index) in cat.Subcategories" :key="index" v-on:click="showCourses(subCat.Category, index)"
              :value="subCat.Title">{{subCat.Title}}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="twelve wide column">
      <div class="row">
        <div class="ui text menu">
          <div class="item">
            <img src="/images/alhuda-media.png">
          </div>
          <div class="ui dropdown item" v-dropdown>
            <div class="text">Browse Courses</div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <div class="item" v-for="(crs, index) in courses" :key="index" :value="crs.Keyword" v-on:click="getCourse(crs.Keyword)">{{crs.Title}}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="ui left pointing red label" v-show="courses.length == 0">Select a category from sidebar</div>
            <div class="ui left pointing green label" v-show="courses.length != 0">Browse Courses in {{selected}}<div class="detail">{{courses.length}}</div></div>
          </div>
          <div class="ui right dropdown item" v-dropdown>
            <div class="text">More</div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <a class="item">Applications</a>
              <a class="item">International Students</a>
              <a class="item">Scholarships</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-if="course.length != 0" class="sixteen wide column">
          <div class="ui accordion fluid styled" v-accordion>
            <div v-for="(top, index) in course.Course.Topic" :key="index">
              <div class="title">
                <i class="dropdown icon"></i>{{top.Title}}</div>
              <div class="content">
                <div class="ui accordion" v-for="(les, index) in top.Lesson" :key="index">
                  <div class="title">
                    <i class="dropdown icon"></i>{{les.Title}}</div>
                  <div class="content">
                    <div class="ui divided list selection">
                      <div class="item" v-for="(res, index) in les.Resource" :key="index" v-on:click="loadAudio(res.DownloadLocation, res.Title)">
                        <i class="play large middle aligned icon"></i>
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
        <div v-show="loader" class="sixteen wide column">
          <div class="ui segment">
            <div class="ui active inverted dimmer">
              <div class="ui medium text loader">Loading Files</div>
            </div>
            <br><br><br><br><br><br><br>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="resource != ''" class="">
    <div class="">
      <a class="" :href="resource" :download="download" target=”_blank”><i class="download icon"></i></a>
      <div class="">{{current}}</div>
    </div>
    <div class="">
      <audio class="" controls>
        <source :src="resource">
      </audio>
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
import axios from 'axios'

export default {
  name: 'zujajah',
  data () {
    return {
      category: [],
      courses: [],
      selected: '',
      current: '',
      course: [],
      resource: '',
      loader: false,
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
    loadAudio: function (res, ttl) {
      this.resource = 'http://alhudamedia.com/' + res
      this.current = ttl
    },
    getCourse: function (val) {
      this.courses = []
      this.loader = true
      axios.get('/resources/xmls/' + val + '.json')
        .then(response => {
          this.course = response.data
          $('.accordion .active').removeClass('active')
          this.loader = false
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    showCourses: function (cat, ind) {
      this.courses = this.category.Categories[cat].Subcategories[ind].Courses
      this.selected = this.category.Categories[cat].Subcategories[ind].Title 
    }
  },

  watch: {
    resource: (url) => {
      $('audio')[0].load(url)
      $('audio')[0].play()
    }
  },

  computed: {
    download: function () {
        return this.current.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')        // Remove all non-word chars
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
        .concat('.mp3');                // Add mp3 to the end
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
  padding: 1em;
  max-width: 950px;
  margin: 0 auto;
  text-align: left;
}

.ui.styled.accordion .accordion .content {
  padding: 0;
}

</style>
