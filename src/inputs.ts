import prompts from 'prompts';

const inputSelectMode = async () => {
    const { value } = await prompts(
        {
            type: 'select',
            name: 'value',
            message: 'Select the mode',
            choices: [
                { title: 'Live sniper', value: 0 },
                { title: 'Last sales', value: 1 },
            ],
            initial: 0
        }
    );
    return value;
}

const inputSetConfig = async () => {
    let { uuid, csrf } = await prompts(
        [
            {
                type: 'text',
                name: 'uuid',
                message: 'Enter your uuid'
            },
            {
                type: 'text',
                name: 'csrf',
                message: 'Enter your csrf token'
            }
        ]);
    uuid = uuid.replaceAll(' ', '');
    csrf = csrf.replaceAll(' ', '');
    return { uuid, csrf };
}

const inputUseProxy = async () => {
    const { value } = await prompts(
        {
            type: 'select',
            name: 'value',
            message: 'Use proxy',
            choices: [
                { title: 'Yes', value: true },
                { title: 'No', value: false },
            ],
            initial: 0
        }
    );
    return value;
}

const inputProxyPath = async () => {
    let { value } = await prompts({
        type: 'text',
        name: 'value',
        message: 'Drag / Type the file with your proxies (*.txt)'
    });
    value = value.replaceAll('"', '');
    if (value.slice(-4) !== '.txt') {
        value += '.txt';
    }
    return value;
}

export { inputSelectMode, inputSetConfig, inputUseProxy, inputProxyPath }
