# CODE met hulp van AJ
#!/usr/bin/env python3
"""
License: MIT License
Copyright (c) 2023 Miel Donkers

Very simple HTTP server in python for logging requests
Usage::
    ./server.py [<port>]
"""
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json
from escpos.printer import Usb
from datetime import datetime
from PIL import Image

# Initialize the thermal printer
p = Usb(0x28e9, 0x0289, 0, 0, 0x81, 3, width=384)

# Mapping of answers to specific texts
answer_text_mapping = {
    "Q5": { #skipped
        "1": "Bijvoorbeeld wie er tot je gezin behoort. Voor jou zijn dat je vader, moeder en broers/zussen. Voor mensen uit culturen met een collectieve identiteit is het gebruikelijk om ook samen te wonen met tantes, ooms, grootouders, etc.\n",
        "2": "Bijvoorbeeld wie er tot je gezin behoort. Voor sommige mensen is dat alleen hun kerngezin (ouders en broers/zussen) en voor anderen hun uitgebreidere gezin (met tantes, ooms, grootouders etc.).\n",
        "3": "Bijvoorbeeld wie er tot je gezin behoort. Voor jou zijn dat je vader, moeder, broers/zussen, tantes, ooms, grootouders etc. Voor mensen die individualistisch zijn opgegroeid is dat niet vanzelfsprekend.\n"
    },
    "Q6": {
        "1": "Privacy: Privacy is voor jou best belangrijk. Je vindt het fijn om je even te kunnen terugtrekken, alleen of met een select gezelschap. Sommige mensen, vooral uit warmere klimaten, zijn gericht op de groep en beschouwen het als onbeleefd om anderen buiten te sluiten in een gesprek of activiteit.\n",
        "2": "Privacy: Sommige mensen, vooral uit koudere klimaten, zijn meer gesteld op privacy, tijd en ruimte voor zichzelf. Anderen, vooral uit warmere klimaten, zijn gericht op de groep en beschouwen het als onbeleefd om anderen buiten te sluiten. Het is belangrijk om je hiervan bewust te zijn in multiculturele situaties.\n",
        "3": "Privacy:Jij ervaart het misschien als vanzelfsprekend om deel te nemen aan een gesprek of activiteit. Sommige mensen, vooral uit koudere klimaten, zijn meer gesteld op privacy, tijd en ruimte voor zichzelf.\n"
    },
    "Q7": {
        "1": "Tijd: Mogelijk ben jij gericht op relaties en gebeurtenissen, en heb je een voelende persoonlijkheid. Het is voor jou belangrijker om een goede relatie met mensen te onderhouden dan op tijd komen. In andere culturen kunnen mensen meer taakgericht zijn, waardoor het belangrijk is dat mensen op tijd komen.\n",
        "2": "Tijd: Als je niet zo strak op de tijd zit, kan je waarschijnlijk goed opschieten met zowel mensen die taakgericht zijn als mensen die relatiegericht zijn.\n",
        "3": "Tijd: Mogelijk ben jij taakgericht, efficient en zie jij een taak als prioriteit. Je vindt het namelijk belangrijk dat mensen op tijd komen. In andere culturen kunnen mensen meer gericht op relaties en gebeurtenissen zijn, en daardoor minder prioriteit geven aan de taak van op tijd komen.\n"
    },
    "Q8": {
        '1': "Bezoek: Waarschijnlijk kom je uit een koud-klimaat cultuur als tijdens een bezoek alle andere activiteiten gestopt worden, bijvoorbeeld het grasmaaien of koken. Dat zijn geplande bezoekjes. Kijk niet gek op als mensen uit warmere klimaten het normaal vinden om mee te draaien met wat er gebeurt!\n",
        '2': "Bezoek: Mensen kunnen erg verschillen in spontane of geplande bezoekjes en wat er van hen verwacht wordt tijdens een bezoek. Vind jij het bijvoorbeeld normaal om mee te draaien met wat er gebeurt of verwacht je dat de dagelijkse bezigheden gestopt worden?\n",
        '3': "Bezoek: Waarschijnlijk hecht je waarde aan ongedwongen en spontane relaties. Je doet gewoon mee in de dagelijkse activiteiten die gebeuren, zoals grasmaaien of koken. Kijk niet gek op als mensen uit koudere klimaten liever iets willen plannen!\n."
    },
    "Q9": { #skipped
        '1': "",
        '2': "",
        '3': ""
    },
    "Q10": {
        '1': "Gezin: Voor jou zijn dat je vader, moeder en broers/zussen. Voor mensen uit culturen met een collectieve identiteit is het gebruikelijk om ook samen te wonen met tantes, ooms, grootouders, en soms nog meer mensen.\n",
        '2': "Gezin: Voor sommige mensen is dat alleen hun kerngezin (ouders en broers/zussen) en voor anderen hun uitgebreidere gezin (met tantes, ooms, grootouders etc.).\n",
        '3': "Gezin: Voor jou zijn dat je vader, moeder, broers/zussen, tantes, ooms, grootouders en misschien nog meer. Voor mensen die individualistisch zijn opgegroeid is dat niet vanzelfsprekend.\n"
    },
    "Q11": {
        '1': "Gastvrijheid: Gastvrijheid verschilt per cultuur. Mensen zijn bijvoorbeeld spontaan en altijd welkom, terwijl in andere culturen verwacht de gastheer/-vrouw dat ze vooraf ingelicht worden. Houd er rekening mee dat de gastheer/-vrouw je de volle aandacht wil geven tijdens een zorgvuldig gepland bezoek.\n",
        '2': "Gastvrijheid: Gastvrijheid verschilt per cultuur. Mensen zijn bijvoorbeeld spontaan en altijd welkom, maar in andere culturen verwacht de gastheer/-vrouw dat ze vooraf ingelicht worden. Houd er rekening mee dat een bezoek anders wordt ervaren afhankelijk van iemands cultuur en gewoontes.\n",
        '3': "Gastvrijheid: Gastvrijheid verschilt per cultuur. Mensen zijn bijvoorbeeld spontaan en altijd welkom, terwijl in andere culturen verwacht de gastheer/-vrouw dat ze vooraf ingelicht worden. Houd er rekening mee dat je gewoon meedraait in de activiteiten van de gastheer/-vrouw tijdens een spontaan bezoek.\n"
    },
   
    "Q13": { #A, B, C. Vraag 1 
        'a': """\n-----------------------------\n\nJij vindt :), het blije gezicht, het beste passen bij de schaduwzijde van het leven. Misschien denk je wel dat iedereen dat denkt. Je antwoord kan te maken hebben met cultuur: mensen afkomstig uit landen met koudere klimaten associeren schaduw vaker met iets negatiefs. Mensen uit een warmer klimaat antwoorden vaker een blij gezicht, omdat zij schaduw ervaren als verkoelend en dus als positief.\n""",
        'b': """\n-----------------------------\n\nJij vindt :|, het neutrale gezicht, het beste passen bij de schaduwzijde van het leven. Misschien ervaar je het soms als positief en soms als negatief, of vond je het een moeilijke vraag. Wist je dat mensen afkomstig uit landen met koudere klimaten schaduw sneller associeren met iets negatiefs en iemand uit een warmer klimaat associeert schaduw sneller met verkoeling en dus als positief.\n""",
        'c': """\n-----------------------------\n\nJij vindt :(, het verdrietige gezicht, het beste passen bij de schaduwzijde van het leven. Misschien denk je wel dat iedereen dat denkt. Je antwoord kan te maken hebben met cultuur: mensen afkomstig uit landen met koudere klimaten associeren schaduw vaker met iets negatiefs. Mensen uit een warmer klimaat antwoorden vaker een blij gezicht, omdat zij schaduw ervaren als verkoelend en dus als positief.\n"""
    }
}

dynamic_responses = {  
    "Q14": { #getal. Vraag 2
        "default": """\n-----------------------------\n\nJij vindt ongeveer {answer} keer per dag iets gek.
Als je op reis bent, zal dit waarschijnlijk veel vaker zijn. Op reis ver van huis ervaar je vaak eerst een cultuurshock, een soort culturele disorientatie. Daarna kan je cultuurstress ervaren. Dat is een langer proces wat van je verwacht dat je je aanpast, dit kan erg vermoeiend zijn. Oefen thuis door eens andere keuzes dan normaal te maken. Bijvoorbeeld naar een andere supermarkt of een andere route fietsen. Kost het meer energie? Misschien. Maar, ben je meer in het moment? Hopelijk wel! Neem dit mee als je nieuwe dingen ervaart en tegenkomt tijdens je project.\n""",        
    },
    "Q15": { #getal. Vraag 3
        "default": """\n-----------------------------\n\nJij fronst ongeveer {answer} keer per dag met je wenkbrauwen. Let de rest van de dag eens op hoe vaak je (onbewust of bewust) fronst. Is het meer dan je verwacht?
\nOpdracht: Frons een paar keer met je wenkbrauwen. Voor extra effect: kijk in de spiegel of naar iemand anders als je fronst. 
Hoe voelt dat? Wat ervaar je en wat doet het met je?

Je wenkbrauwen fronsen wanneer je iets gek vindt of er gebeurt iets wat je niet gewend bent. Met het fronsen trek je ook snel een oordeel. 
\nProbeer situaties niet te begrijpen met de kennis die je hebt. Die kennis past namelijk bij je eigen cultuur en gewoontes. Probeer daarom de kennis te vinden die past bij de situatie en mensen. Dat doe je door open vragen te stellen: hoe, waarom, waardoor?
\nWanneer je je wenkbrauwen voelt fronsen, wees dan nieuwsgierig en stel open vragen!\n"""        
    }
    # Add more questions and their mappings here
}

class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins
        # self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')  # Allow specific methods
        # self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Allow specific headers
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))
           
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])  # Get the size of data
        post_data = self.rfile.read(content_length)  # Get the data itself
        logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                    str(self.path), str(self.headers), post_data.decode('utf-8'))
        body = post_data.decode('utf-8')
        data = json.loads(body)

        my_name = data.get('myName', '..........')
        answers = data.get('answers', {})

        # Date for the receipt
        date_today = datetime.now().strftime("%d %B %Y")

        receipt_template = (
            f"""\n\nBon van Betekenis van\n{my_name}\n"""
            f"{date_today}"
"\n\n"
"""Bewaar dit bonnetje goed en herhaal regelmatig om het parkeren van je cultuur te verlengen.
\n-----------------------------\n
Voordat je op project gaat en een gemeenschap met een heel andere cultuur gaat ontmoeten, is het belangrijk om je bewust te zijn dat je ook een eigen cultuur meedraagt. Je opvoeding, omgeving, gewoontes, normen en waarden beinvloeden namelijk je denken en gedragingen. Laten we eens kijken wat jij antwoordde op de stellingen.\n""") 

        for question_id, answer in answers.items():
            dynamic_text = process_dynamic_text(question_id, answer)
            # if/elif: only the first statement/answer asked in randomPage1 will be executed
            if question_id == "Q5": #stelling 1
                # Insert the corresponding text for Q5
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q6": #stelling 1
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q7": #stelling 2
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q8": #stelling 3
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q9": #stelling 4
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q10": #stelling 5
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            elif question_id == "Q11": #stelling 6
                receipt_template += f"{dynamic_text}\n" # tekst van "Vraag 5" moet uiteindelijk weg
            # Q12 removed
            elif question_id == "Q13":  # Vraag 1: smileys
                receipt_template += f"""{dynamic_text}\n"""                
            elif question_id == "14":  # Vraag 2: gek
                receipt_template += f"{dynamic_text}\n"                
            elif question_id == "Q15":  # Vraag 3: fronsen
                receipt_template += f"{dynamic_text}\n"                
            else: # HIER ONTSTAAT EEN LOOP als er tekst in staat. Dus alleen logging.
                logging.warning(f"Unexpected question ID: {question_id}. No matching text found.")

         # Append to receipt
        receipt_template += """
\n-----------------------------\n
Elke cultuur is aangeleerd en wordt gevormd door veel factoren. Cultuur is daarom relatief en verschilt van persoon tot persoon. Bespreek eens met projectgenoten en een bewoner in het projectland wat hun gewoontes of normen zijn rondom privacy, familie, relaties, spontaniteit, op bezoek gaan of tijd.
Wat zijn de verschillen en overeenkomsten tussen jullie (persoonlijke) culturen?
\nSchrijf hieronder dingen uit jouw achtergrond die invloed kunnen hebben op je ervaringen in het projectland, bijvoorbeeld dingen die voor jou normaal zijn:
\n..........................
\n..........................
\n..........................
\n..........................
\n..........................
\nVerandert jouw "normaal" tijdens het project? Denk daar regelmatig over na. 
\n-----------------------------\n
Beschouw het leren over een andere cultuur als een ontmoeting. Dat is neutraal en zonder oordeel. Hiervoor moet je bewust in het moment zijn. 
\n
Je kan deze ontmoetingen trainen door de 54321-oefening. Benoem\n
5 dingen die je ziet, 
4 dingen die je hoort,
3 dingen die je voelt,
2 dingen die je ruikt,
1 ding wat je proeft.
\n-----------------------------\n
Bedankt voor het parkeren van je cultuur. Blijf reflecteren op je cultuur door jouw Bon van Betekenis mee te nemen op project, met anderen de delen en regelmatig door te nemen.\n"""

            # Print the receipt
        try:
            print_logo()  # Print the logo at the top
            p.text("\n\n") # Print some space after the logo
            p.text(receipt_template)
            print_logo()  # Print the logo at the bottom
            p.cut()  # Cut the paper after printing
            # p.text("\n\n") # Print some space after the logo
            logging.info("Receipt printed successfully.")    
        except Exception as e:
            logging.error(f"Error while printing: {e}")

        self._set_response()
        response = {"ok": True}
        self.wfile.write(json.dumps(response).encode('utf-8'))

def print_logo():
        try:
            # Load the logo
            logo = Image.open("C:/Users/20192336/OneDrive - TU Eindhoven/ID MASTER/M2.2/W13-15 Final design folder/WS-logo-black.bmp")
            p.set(align='center')
            p.image(logo)
            logging.info("Logo printed successfully.")
        except Exception as e:
            logging.error(f"Error while printing logo: {e}")

# 2x process_dynamic_text combined:
def process_dynamic_text(question_id, answer):
    # Check if the question ID exists in the static mapping
    if question_id in answer_text_mapping:
        # Get the specific answer mapping
        specific_mapping = answer_text_mapping[question_id]
        # Return the corresponding text if the answer exists
        return specific_mapping.get(str(answer), f"Onbekend antwoord voor {question_id}.")
    elif question_id in dynamic_responses:
        # Handle dynamic responses with placeholders
        default_response = dynamic_responses[question_id].get("default", "")
        return default_response.replace("{answer}", str(answer))
    # Fallback if no match is found
    return f"Geen tekst gevonden voor vraag {question_id}."

def run(server_class=HTTPServer, handler_class=S, port=5000):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
