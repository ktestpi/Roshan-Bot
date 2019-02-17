module.exports = class EmbedBuilder {
    constructor(schema) {
        this.schema = schema
    }
    build(client, lang, replacements) {
        const embed = {}
        const replacer = embedReplacer(client, lang, replacements)
        if (this.schema.author) {
            embed.author = {}
            if (this.schema.author.name) {
                embed.author.name = replacer(this.schema.author.name)
            }
            if (this.schema.author.ur) {
                embed.author.ur = replacer(this.schema.author.ur)
            }
        }
        if (this.schema.title) {
            embed.title = replacer(this.schema.title)
        }
        if (this.schema.description) {
            embed.description = replacer(this.schema.description)
        }
        if (this.schema.fields) {
            embed.fields = this.schema.fields.map(field => {
                return {
                    name: replacer(field.name),
                    value: replacer(field.value),
                    inline: field.inline
                }
            })
        }
        if (this.schema.thumbnail) {
            embed.thumbnail = {
                url: replacer(this.schema.thumbnail.url),
                height: this.schema.thumbnail.height || 40,
                width: this.schema.thumbnail.height || 40
            }
        }
        if (this.schema.footer) {
            embed.footer = {}
            if (this.schema.footer.text) {
                embed.footer.text = replacer(this.schema.footer.text)
            }
            if (this.schema.footer.icon_url) {
                embed.footer.icon_url = replacer(this.schema.footer.icon_url)
            }
        }
        embed.color = this.schema.color !== undefined ? this.schema.color : client.config.color
        return { embed }
    }
    if(condition, schema){
        if(condition){
            this.schema = Object.assign(this.schema,schema)
        }
        return this
    }
    fn(condition, func){
        if(condition){func(this.schema)}
        return this
    }
}

function embedReplacer(client, languageFlag, replacements){
    return function(str){
        console.log('str', str, languageFlag || client.locale.defaultLanguage, client.locale.lang[languageFlag || client.locale.defaultLanguage][str], replacements)
        return client.locale.replacer(client.locale.lang[languageFlag || client.locale.defaultLanguage][str] || str, replacements)
    }
}