import fs from 'fs'
import os from 'os';
import path from 'path';
import cpy from 'cpy'
import inquirer from 'inquirer'
import { templates } from '../../constances/templates'


function isAvailableDirectory() : boolean{
    const directories = path.basename(path.resolve())
    if(directories==='xquare-frontend' 
    || directories==='services') return true
    return false
}
function getSetUpDirectory(name : string) : string { 
    const directories = path.basename(path.resolve())
    const now = path.resolve();
    if(directories==='xquare-frontend'){
        return path.join(now, `packages/services/${name}`)
    }
    else{
        return path.join(now,name)
    }
}

function createPackageJson(directory : string, name : string) {
    const packageJson = {
        name : `@service/${name}`,
        version : '1.0.0',
    }
    return fs.writeFileSync(
        path.join(directory, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );
}

async function getTemplates() {
    const { template } = await inquirer.prompt(templates)
    return template
}

async function createXFrontEnd(name : string){
    const available = isAvailableDirectory();
    if(available){
        const directory = getSetUpDirectory(name)
        const template = await getTemplates()
        await cpy('**',directory, {
            parents: true,
            cwd: path.join(__dirname, '../../../src/templates', template)
        })
        createPackageJson(directory, name)
        console.log('✅ 서비스 추가 완료!')
    }else{
        console.log('❌ root 혹은 service 디렉토리 내에서 사용해주세요')
    }
}



function Service(name : string){
    createXFrontEnd(name)
}
export default Service
