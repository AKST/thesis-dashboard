import DS from 'ember-data';

const { attr, Model } = DS
const PROJECT_PATH_REGEX = /^git@github.com:(.*).git$/

export default Model.extend({
  name: attr('string'),
  minGhc: attr('semver'),
  maxGhc: attr('semver'),
  repoUrl: attr('string'),
  commitHash: attr('string'),

  githubLink: function () {
    const { repoUrl, commitHash } = this.getProperties('repoUrl', 'commitHash')
    const match = repoUrl.match(PROJECT_PATH_REGEX)
    if (match) {
      const projectPath = match[1];
      return `https://github.com/${projectPath}/tree/${commitHash}`;
    }
    return null
  }.property('repoUrl', 'commitHash'),
})
