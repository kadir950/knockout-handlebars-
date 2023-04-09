
    //Test template >>>  `<div class="deneme"><b data-bind="text: $data.name"></b> {{$data.name}}</div>`

    Handlebars.registerHelper("_koEvaluator", function (_val, _args) {
        if (!_val) return;       
        return new Handlebars.SafeString(ko.bindingProvider.instance.parseBindingsString("myExp:" + _val, _args.data.root.koBindingContext)["myExp"]);
    });


    (function () {

        const HandlebarsEngine = function () {

            function executeTemplate(compiledTemplate,  handlebarsTemplateOptions) {
                return  compiledTemplate(handlebarsTemplateOptions, {
                    allowProtoMethodsByDefault: true,
                    allowProtoPropertiesByDefault: true
                });
            }

            this.renderTemplateSource = function (templateSource, bindingContext, _options, _templateDocument) {
               
                let precompiled = templateSource['data']('precompiled');

                if (!precompiled) {
                    const templateText = `{{#with koBindingContext}}${(templateSource['text']() ?? "")}{{/with}}`;
                    precompiled = Handlebars.compile(templateText, {});
                    templateSource['data']('precompiled', precompiled);
                }
                                
                const resultNodes = executeTemplate(precompiled, { 'koBindingContext': bindingContext });
                const divx = document.createElement('div');
                divx.innerHTML = resultNodes;
                return Array.from(divx.children);
            };

            this.createJavaScriptEvaluatorBlock = function (script) {
                return `{{_koEvaluator "${script}" }}`;
            };        
        };

        HandlebarsEngine.prototype = new ko.templateEngine();
        HandlebarsEngine.prototype.constructor = HandlebarsEngine;

        ko.HandlebarsEngine = HandlebarsEngine;
        ko.setTemplateEngine(new HandlebarsEngine());
    })();
