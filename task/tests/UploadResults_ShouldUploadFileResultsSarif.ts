import * as mr from 'azure-pipelines-task-lib/mock-run';
import * as mtr from 'azure-pipelines-task-lib/mock-toolrunner';

import path = require('path');
import * as helpers from './MockHelper';
import { TaskLibAnswers } from 'azure-pipelines-task-lib/mock-answer';

const taskPath = path.join(__dirname, '..', 'index.js');
let tmr: mr.TaskMockRunner = new mr.TaskMockRunner(taskPath);

// Inputs
tmr.setInput('version', 'latest');
tmr.setInput('configType', 'default');
tmr.setInput('scanfolder', __dirname);

tmr.setInput('nogit', 'false');
tmr.setInput('verbose', 'false');
tmr.setInput('uploadresults', 'true');
tmr.setInput('reportformat', 'sarif');
tmr.setInput('taskfail', 'true');

const executable = 'gitleaks-darwin-amd64';

helpers.BuildWithDefaultValues();

tmr = helpers.BuildWithEmptyToolCache(tmr);
tmr.registerMock('azure-pipelines-task-lib/toolrunner', mtr);
tmr.setAnswers(<TaskLibAnswers>{
        exec: {
                [helpers.createToolCall(executable, undefined, undefined, 'sarif')]: {
                        'code': 1,
                        'stdout': 'Gitleaks tool console output',
                },
        },
        exist: {
            [helpers.reportFile('sarif')]: true,
    },
});
tmr = helpers.BuildWithDefaultMocks(tmr);

tmr.run();