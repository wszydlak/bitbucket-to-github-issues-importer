## [BitBucket to GitHub Issues Importer](http://wszydlak.github.io/bitbucket-to-github-issues-importer/)
---
#### Basic Informations:
This is **node.js** application which allows You to import **BitBucket** issues to **GitHub**.

Application has support for:

- issues
- labels
- milestones
- comments

---
#### Requirements
- [NodeJS](https://nodejs.org) (tested on 0.12.7)
- Generated [GitHub AccessToken](https://github.com/settings/tokens)
- Exported BitBucket Issues to **json** file format (https://bitbucket.org/:owner/:repo/admin/issues/import-export)

---
#### Usage:
###### 1. Install node required modules
```
npm install
```

###### 2. Run importer
```
node import.js -f {file} --owner {owner} --repo {repo} --token {token} -{items}
```

- file => path to exported from bitbucket file with issues data
- owner => name of GitHub account
- repo => name of GitHub repository
- items => items to import, which can be:
    - i => issues
    - l => labels
    - c => comments
    - m => milestones
  
---
#### Examples:

###### Import issues, comments, labels and milestones:
```
node import -f test.json --owner test --repo test_repo --token 123 -iclm
```

###### Import issues only:
```
node import -f test.json --owner test --repo test_repo --token 123 -i
```

###### Import issues and comments:
```
node import -f test.json --owner test --repo test_repo --token 123 -ic
```

###### Import milestones and labels:
```
node import -f test.json --owner test --repo test_repo --token 123 -ml
```
