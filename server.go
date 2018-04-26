package main

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/cdreier/golang-snippets/snippets"
	"github.com/go-chi/chi"

	"github.com/gobuffalo/packr"
)

func main() {

	host := os.Getenv("HOST")

	r := chi.NewRouter()

	snippets.ChiFileServer(r, "/assets", packr.NewBox("./assets"))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		box := packr.NewBox("./www")
		tmpl, err := template.New("index").Parse(box.String("index.html"))
		if err != nil {
			log.Panic(err)
		}
		data := map[string]string{
			"HTTP_HOST": host,
		}
		tmpl.Execute(w, data)
	})

	log.Println("started on port 8080 on host " + host)
	http.ListenAndServe(":8080", r)
}
