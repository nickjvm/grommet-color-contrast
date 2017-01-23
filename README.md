[![Build Status](http://hellfiredrone.ftc.hpeswlab.net:8882/api/badges/hcoe/ui/status.svg)](http://hellfiredrone.ftc.hpeswlab.net:8882/hcoe/ui)
[![Coverage](http://hellfiredrone.ftc.hpeswlab.net/badges/hcoe/ui/coverage.svg)](http://hellfiredrone.ftc.hpeswlab.net/hcoe/ui)

##[HCOE UI Simulator <img src="https://github.hpe.com/hcoe/hcoe/wiki/images/fire.jpg" width="48">](http://16.71.84.1:8114/dashboard)

# HCOE UI

## Contents
  * [Install](#install)
  * [Usage](#usage)
    * [Development Mode](#development-mode)
    * [Production Mode](#production-mode)
  * [Testing](#testing)
  * [Updating Deps](#updating-deps)
  * [Misc](#misc)
    * [IdM Integration](#idm-integration)
    * [Architecture](#architecture)
    * [JS Conventions](#js-conventions)
    * [Styling Conventions](#styling-conventions)
    * [Further Reading](#further-reading)
    * [Docker Image](#building-and-deploying-docker-image)
    * [Release/Promote UI Process](#releasepromote-ui-process)

## Install

1. Install Node.js (https://nodejs.org/)
1. Set NPM proxy:

  ```sh
  $ npm config set proxy http://web-proxy.fc.hp.com:8088/
  $ npm config set https-proxy http://web-proxy.fc.hp.com:8088/
  ```

1. Install [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) globally:

  ```sh
  $ npm install -g gulp
  ```

1. Install [yarn](https://yarnpkg.com/en/docs/install) globally:

  ```sh
  $ npm install -g yarn
  ```

1. Install local deps:

  ```sh
  $ yarn install
  ```

1. Create your local configuration file:

  ```sh
  # Use cp instead of mv
  $ cp grommet-toolbox.config.local.example grommet-toolbox.config.local.js
  ```

1. Edit the `grommet-toolbox.config.local.js` file as needed. This file is not tracked by
  git so it will forever be your dev config playground. If you want to run the UI
  against a real BE you'll need to swap out `proxy` for the BE IP address.

## Usage

### Development Mode

In development mode both the mock server (`/server`) and the UI server run in parallel.
To accomplish this you'll need to run both in different processes:

1. Start the mock backend server:

  ```sh
  $ cd server/
  $ gulp dev
  ```

2. Start the UI development server:

  ```sh
  $ gulp dev
  ```

**Note:** If you are using the `proxy` setting to point to a real BE there is no need
to run the mock server.

### Production Mode

1. Build production UI

  ```sh
  $ gulp dist
  ```

2. Deploy the UI with mock server

  ```sh
  $ npm start
  ```

3. Open browser to [http://localhost:8114/dashboard](http://localhost:8114/dashboard)

#### Alternatively, run current released version

1. Deploy the released UI with mock server

  ```sh
  $ ./deploy
  ```

2. Open browser to [http://localhost:8114/dashboard](http://localhost:8114/dashboard)

## Testing
Find full testing documentation in the [wiki page](https://github.hpe.com/hcoe/ui/wiki/Tests).

Testing can be do with the following commands or gulp tasks:

#### Run Tests

```sh
# Npm
npm test

# Gulp
gulp test
```

#### Run Tests With Full Output:

```sh
# Npm
npm run -s jest -- --verbose
```

#### Run Tests on Changes:

```sh
# Npm
npm run -s jest -- --watch

# Gulp
gulp test:watch
```

#### Coverage

```sh
# Npm
npm run -s jest -- --coverage

# Gulp
gulp test:coverage
```

## Updating Deps
To update project dependencies:

1. Run `yarn outdated` and read each CHANGELOG or commit history accordingly.
1. Update each dependency: `yarn upgrade my-dep`.
1. Verify that both `package.json` and `yarn.lock` have been updated correctly.
1. **Test thoroughly.** Improper testing can break everyone's environment.
  1. Run `npm test`
  1. Run through UI and make sure that things work as they should.
1. Commit any changes to a new branch, `deps/update-[date]`.
1. Submit a PR for review and further testing.
1. Once merged, let everyone know to re-install node modules on the Hellfire UI channel.

**Note: Do not update babel-plugin-resolver from v0.0.6 until an issue is fixed as it will break on Windows.**

## Misc

### IdM Integration

This application connects to an IdM service through the [rest api (v0)](https://rndwiki.corp.hpecorp.net/confluence/pages/viewpage.action?title=IdM+Documentation+1.x+-+Request+Token+REST+API&spaceKey=HPUI).

### Architecture
  * assets/     = Are shared images, and styling themes.
  * elements/   = Are very basic dumb components, without extending react.
  * components/ = Are dumb components that extend react.
  * containers/ = Are very smart! They are basically the view, and handle the logic.
  * modules/     = Are files that contain gouped: constants, actions, sagas, and reducers.
  * routes/     = Are all of the clientside routes - mapped paths to containers.
  * sagas/      = Contains the index of all sagas that allows for easy import into the redux-store;
  * services/   = Contains API's for AJAX requests.
  * store/      = Contains the redux-store configurations and custom middleware.
  * utils/      = Utility methods and functions that is used across app.
  * index.html  = Is a templated entry point.
  * index.js    = Is our app entry point.

### JS Conventions
  - When importing grommet or other libraries specify the path, rather than deconstructing.
    - This is preferred by the grommet team.
    - It helps decrease build sizes and times.

  ```js
  // Bad
  import {Header} from 'grommet';
  import {compact} from 'lodash';

  // Good
  import Header from 'grommet/components/Header';
  import compact from 'lodash/compact';
  ```

  - When there are more than 2 props on a component wrap to new lines:

  ```jsx
  render() {
    <Component attr1={} attr2={} />
  }

  render() {
    <Component
      attr1={}
      attr2={}
      attr3={} />
  }
  ```

  - Always add PropTypes. This acts as an API and will help with debugging.

  ```jsx
  class IamComponent extends Component {
    static propTypes = {
      action: PropTypes.func.isRequired,
      anotherAction: PropTypes.func.isRequired,
      state: PropTypes.object.isRequired
    };

    render() {

    }
  }
  ```

  - Keep react components dumb and testable by mapping state to props, as well as actions
  to props -- this allows for proper propagation of actions through this.props
  (letting redux drive).

  ```js
  export const stateToProps = state => ({
    count: state.counter.count
  })

  export default connect(stateToProps, actions)(Component);
  ```

### Styling Conventions
  - Styles should only be applied to components or elements as their only concern is presentation.
    *Do not apply styles to containers, they're only concern is with how things work.*
  - className should be on wrapping `<div>` as the Component or Container name and
    utilize SASS nesting.

  ```jsx
  render() {
    return(
      <div className="component-name" >
        <h1 className="generic-name">Hello World</h1>
        <h2 className="foo">Foo</h2>
        <h3 className="bar">Bar</h3>
        <OtherComponent />
      </div>
    );
  }
  ```

  ```scss
  .component-name{
    background-color: green;
    .generic-name{
      color: purple;
    }
    .foo {
      color: green;
    }
    .bar {
      margin-left: 15px;
    }
  }
  ```
  - `__dirname/src/assets/styles/styles.scss`
    - Imports Grommet dependent styles
    - App wide theming
  - Components that require custom styling should contain a sibling scss file:
    ```
    +--Component
    |   +-- index.js
    |   +-- styles.scss
    ```
  - You still need to use `@import` inside your sass files to use shared variables and mixins.
  - Be careful that any file you `@import` doesn't contain selectors, else they may be duplicated
  - Order of files is non-deterministic. Make sure order doesn't matter

### Further Reading
  * [grommet](http://www.grommet.io/docs/develop)
  * [webpack](https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.hfvlwae25)
  * [react](http://reactkungfu.com/)
  * [react-router](https://medium.com/@arpith/using-react-router-1f96209fe557#.oe2xyweye)
  * [redux](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)
  * [redux-sagas](https://medium.com/infinite-red/using-redux-saga-to-simplify-your-growing-react-native-codebase-2b8036f650de#.4y9toj20g)
  * [jest](https://facebook.github.io/jest/docs/getting-started.html)


### Building and Deploying Docker Image

*An additional dev-only Docker image is provided at
[hcoe/docker-idm](https://github-sc-p.corp.hp.com/hcoe/docker-idm).*

#### Build the Image
- This docker image will copy the `./dist` subdirectory into internal `/app/dist`
- The `./dist` directory should exist and contain the bundled application

  ```sh
  npm run build
  ```

- Syntax for building the docker image is `docker build -t $NAME:$TAG .`

  ```sh
  docker build -t hcoe/ui:0.0.75 .
  ```

#### Run the Container

- Running this container will start nginx to serve the static ui app and reverse
  proxy to `hcm` server.

- This is suitable for production environments.

- **You need to have HCM server running for this image to work properly**

- Example docker run commands:

  *prerequisite: have the hcm server running & note the running hcm container's name*

- If the hcm server is running with name `hcm`, start the ui container with nginx
  server with:

  ```sh
  # where $NAME is `hcoe/ui` and $TAG is `0.0.75`
  docker run -d --name ui \
    -p 8080:80 \
    --link hcm:hcm \
    hcoe/ui:0.0.75
  ```

  Line by line:

  ```sh
  # -d means run this container daemonized
  # --name is optional and recommended, to name the running container 'ui'
  docker run -d --name ui \
  ```

  ```sh
  # -p will bind the host port `8080` to internal port, nginx is listening on port `80`
  # 8080 can be changed to any port number
  -p 8080:80 \
  ```

  ```sh
  # --link hcm:hcm means add a link to the container named `hcm` running on the same host
  # nginx is proxying to a host named hcm at local port `8080` (hcm binds to 8080 internally)
  --link hcm:hcm \
  ```

  ```sh
  # the name of this image and the version tag
  hcoe/ui:0.0.75
  ```

  No other commands are applied to start the container, by default, `/usr/sbin/nginx`
  is running in the foreground.

- To debug or inspect this container, use the following command:

  ```sh
  docker run -it --name ui-debug \
    -p 8081:80 \
    --link hcm:hcm \
    hcoe/ui:0.0.75 bash
  ```

#### Run the Container in K8S Cluster

- You may omit the docker `--link` command so long as the `HCM_PORT` env var is set

  ```
  -e HCM_PORT=tcp://172.0.0.32:8080
  ```

  or

  ```
  -e HCM_PORT=172.0.0.32:8080
  ```

- This value will be written to the ui `/etc/nginx/nginx.conf` file as a backend to reverse proxy to.

**Note:** if this env var is not set, and `--link hcm_container_name:hcm` is not used,
then the container will fail to write the `nginx.conf` and error out.

## Release/Promote UI Process

* From any branch:

    ```sh
    $ gulp release
    ```

* There are currently 2 PA systems, [PA.140](http://16.71.82.140:9005) or
  [PA.234](http://16.71.82.234:9005).
  * Enter your HPE simplified email address and click 'Create, BAT, and promote my private assembly'.
  * On the next page a list of versions for all the containers should show in a table below
  * Enter the UI version you wish to promote in the Right column of the table for the UI row.
  * Click 'Build'
  * In about an hour you should get an email with a PASS or FAIL for the PA.

* If you have any issues with the PA process, send an email to shrirang-r.hedge@hpe.com to have him fix the system or release the UI for you. You can also look at the [private assembly wiki](https://github.hpe.com/hcoe/private-assembly/wiki) for troubleshooting tips.
