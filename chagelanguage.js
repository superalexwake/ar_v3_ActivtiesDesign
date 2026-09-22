const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const results = []
const outputDirectory = path.join(__dirname, 'languageCvs')

fs.createReadStream(path.join(outputDirectory, 'language.csv'))
	.pipe(csv())
	.on('data', (data) => results.push(data))
	.on('end', () => {
		deleteTSCFiles('languageCvs', () => {
			generateTSFiles(results)
		})
	})

function deleteTSCFiles(directory, callback) {
	fs.readdir(directory, (err, files) => {
		if (err) throw err

		files.forEach((file) => {
			const filePath = path.join(directory, file)
			if (file.endsWith('.ts')) {
				fs.unlinkSync(filePath)
				console.log(`Deleted ${filePath}`)
			}
		})

		callback()
	})
}

function generateTSFiles(data) {
	const keys = Object.keys(data[0])
	for (let i = 1; i < keys.length; i++) {
		const columnName = keys[i]
		const tsData = {}

		for (const row of data) {
			const key = row[keys[0]]
			const value = row[columnName]
			// const value = row[columnName].replace(/"/g, "\"");
			if(value.trim().length>0){
				tsData[key] = value.trim().replace(/[\n\r]/g, '') // 使用单引号包裹值
				if (tsData[key].indexOf("'") != -1) {
					tsData[key] = '`' + tsData[key] + '`'
				}
			}
		}
		const tsCode = `export default ${JSON.stringify(tsData, null, 2)
			.replace(/\"([^(\")"]+)\":/g, '$1:')
			.replace(/"/g, "'")
			.replace(/'`/g, '`')
			.replace(/`'/g, '`')
			.replace(/\\'/g, '"')}`
		const fileName = `${columnName}.ts`
		const filePath = path.join(outputDirectory, fileName) // 构建完整的文件路径
		fs.writeFileSync(filePath, tsCode, 'utf8')
		console.log(`Generated ${fileName}`)
	}
}
