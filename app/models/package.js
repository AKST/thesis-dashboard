import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import computed from 'ember-computed-decorators'


const PROJECT_PATH_REGEX = /^git@github.com:(.*).git$/

export default Model.extend({
  name: attr('string'),
  minGhc: attr('semver'),
  maxGhc: attr('semver'),
  repoUrl: attr('string'),
  commitHash: attr('string'),

  @computed('repoUrl', 'commitHash')
  githubLink (repoUrl, commitHash) {
    const match = repoUrl.match(PROJECT_PATH_REGEX)
    if (match) {
      const [, projectPath] = match
      return `https://github.com/${projectPath}/tree/${commitHash}`
    }
    return null
  },
})
