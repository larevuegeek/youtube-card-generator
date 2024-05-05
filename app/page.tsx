"use client"
import {NextUIProvider} from "@nextui-org/react";
import Link from 'next/link'

import React, { useState } from 'react';
import {Slider, Switch, Select, SelectItem, Accordion, AccordionItem} from "@nextui-org/react";
import {MoonIcon} from "./_components/svg/MoonIcon";
import {SunIcon} from "./_components/svg/SunIcon";

import CardOptions from "./_types/CardOptions";
import { YoutubeVideo } from "./_types/YoutubeVideo";
import handleYoutubeFetcher from "./_action/form/handleYoutubeFetcher";
import InputUrl from "./_components/form/input/inputUrl";
import GenerateButton from "./_components/form/button/generateButton";
import DownloadButton from "./_components/form/button/downloadButton";
import ImgCard from "./_components/card/imgCard";
import html2canvas from 'html2canvas';
import slugify from "slugify";
import { saveAs } from 'file-saver';
import { HeartIcon } from '@heroicons/react/24/outline'

export default function Home() {
  
    const sizes = [
      { label: 0.7, description: 'Très petite (0.7x)', resolution: '320x480' },
      { label: 1, description: 'Petite (1x)', resolution: '320x480' },
      { label: 2, description: 'Moyenne (2x)', resolution: '480x640' },
      { label: 3, description: 'Large (3x)', resolution: '768x1024' },
      { label: 4, description: 'Extra large (4x)', resolution: '1024x768' },
    ];

    interface cardData {
      cardOptions: CardOptions,
      youtubeVideo: YoutubeVideo
    }

    const defaultCardOption = {
      size: 1,
      hideTitle: false,
      hideChannel: false,
      hideAuthor: false,
      hideView: false,
      hideDate: false,
      hideDuration: false,
      hideProgressBar: false,
      darkMode: false,
      progressBarPercent: 100
    }

    const defaultYoutubeVideo = {
      videoId: "XEO3duW1A80",
      url: "https://www.youtube.com/watch?v=XEO3duW1A80",
      urlThumbnail: "https://img.youtube.com/vi/XEO3duW1A80/maxresdefault.jpg",
      urlThumbnailChannel: "https://yt3.ggpht.com/ePr4Q4DVIpU8GBSk0bAkias_6GJivzuuiHQQb804UT9eNw3BbEUWNhV9dLIjIbWf7SZbLa6tYg",
      title: "Je quitte mon CDI de Designer",
      author: "BastiUI",
      duration: 'PT9M27S',
      views: 30000,
      publishedDatetime: '2022-08-14T02:00:23-07:00'
    }
    
    const [download, setDownload] = useState(false);
    const [error, setError] = useState('');
    const [cardData, setCardData] = useState<cardData>({ cardOptions: defaultCardOption, youtubeVideo: defaultYoutubeVideo });

    const handleChange = (option: keyof CardOptions, value: boolean | number | string) => {
      setCardData(prevData => ({
        ...prevData,
        cardOptions: {
            ...prevData.cardOptions,
            [option]: value
        }
      }));
    };

    const handleSubmit = async (formData: FormData) => {
        const result = await handleYoutubeFetcher(formData);
        setError('');
        setDownload(false);

        if (result.error) {
            setError(result.error);
        } 
        else {
            if(result.data !== null) {
              setCardData(prevData => ({
                ...prevData,
                youtubeVideo: result.data
              }));

              setDownload(true);
            }
        }
    };

    const handleSubmitDownload = async (formData: FormData) => {
      
        const element = document.getElementById(cardData.youtubeVideo.videoId);
        if (element) {

          //Correction d'un décalache etrange du text...
          const durationElement = element.querySelector('.video-duration');
          if (durationElement instanceof HTMLElement) {
              durationElement.style.top = '-7px';
          }
          
          html2canvas(element, { 
              backgroundColor: null,
              scale: cardData.cardOptions.size as number,
              logging: false,
              useCORS: true,
              allowTaint : false,
          }).then(canvas => {
              canvas.toBlob(function(blob) {
                  if (blob) {
                      const filename = slugify(cardData.youtubeVideo.title, {
                          lower: true
                      }) + '.png';

                      saveAs(blob, filename);

                      if (durationElement instanceof HTMLElement) {
                        durationElement.style.top = 'unset';
                    }
                  }
              });
          }).catch(error => {
              console.error("Erreur lors de la création de l'image", error);
          });
        } 
        else console.error("Élément DOM non trouvé");
    };

    return (
      <NextUIProvider>
      <div className="py-5 px-2 lg:py-24 sm:py-32">
        <div className="bg-white mx-auto max-w-5xl shadow-2xl rounded-lg py-10 px-6 lg:p-8">
          <div className="mx-auto max-w-2xl text-center">
          < span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-3">
              Développé avec passion <HeartIcon className="h-5 w-5 ms-2"></HeartIcon> 
            </span>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Youtube Card Generator
            </p>
            <p className="mt-6 lg:text-lg lg:leading-8 text-gray-600">
              Générez et téléchargez des miniatures de vidéos YouTube avec 
              ce générateur de cartes au format PNG. 
              Exportez facilement vos créations pour 
              les partagez plus facilement !
            </p>

            <form action={handleSubmit} className="mx-auto mt-5">
              <div className="flex flex-col lg:flex-row">
                <InputUrl name="url_youtube" placeholder="URL Youtube ex : https://www.youtube.com/watch?v=XXXX" error={error}></InputUrl>
                <GenerateButton text="Générer"></GenerateButton>
              </div>
              {error && <p className="text-red-500 mt-3 font-sm font-semibold">{error}</p>}
            </form>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="mt-10 text-center lg:me-5">
                <div className="p-4 border-2 rounded-lg">
                  <div className="flex items-center justify-center my-2">
                      <Switch
                      size="md"
                      color="secondary"
                      checked={!cardData.cardOptions.darkMode}
                      onChange={() => handleChange('darkMode', !cardData.cardOptions.darkMode)}
                      startContent={<SunIcon />}
                      endContent={<MoonIcon />}
                      >Dark mode
                      </Switch>
                  </div>

                  <div className="my-5">
                      <Select
                      items={sizes}
                      label="Taille de la carte"
                      placeholder="Sélectionner une taille"
                      className="max-w-xs"
                      onChange={(e) => handleChange('size', e.target.value)} 
                    >
                      {(sizes) => <SelectItem key={sizes.label} value={sizes.label}>{sizes.description}</SelectItem>}
                    </Select>
                  </div>

                  <div className="px-2">
                    <Accordion>
                      <AccordionItem key="1" aria-label="Accordion 1" subtitle="Configuration avancée de la carte" title="Personnaliser">
                        <div className="flex items-center mb-2">
                            <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideTitle}
                            onChange={() => handleChange('hideTitle', !cardData.cardOptions.hideTitle)}
                            >
                            Masquer le titre
                            </Switch>
                        </div>

                        <div className="flex items-center mb-2">
                          <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideChannel}
                            onChange={() => handleChange('hideChannel', !cardData.cardOptions.hideChannel)}
                            >
                            Masquer la chaine
                            </Switch>
                        </div>

                        <div className="flex items-center mb-2">
                            <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideView}
                            onChange={() => handleChange('hideView', !cardData.cardOptions.hideView)}
                            >
                            Masquer les vues
                            </Switch>
                        </div>

                        <div className="flex items-center my-2">
                          <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideDate}
                            onChange={() => handleChange('hideDate', !cardData.cardOptions.hideDate)}
                            >
                            Masquer la date
                            </Switch>
                        </div>

                        <div className="flex items-center my-2">
                          <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideAuthor}
                            onChange={() => handleChange('hideAuthor', !cardData.cardOptions.hideAuthor)}
                            >
                              Masquer auteur
                            </Switch>
                        </div>

                        <div className="flex items-center my-2">
                            <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideDuration}
                            onChange={() => handleChange('hideDuration', !cardData.cardOptions.hideDuration)}
                            >
                            Masquer la durée
                            </Switch>
                        </div>

                        <div className="flex items-center my-2">
                          <Switch 
                            size="sm"
                            checked={!cardData.cardOptions.hideProgressBar}
                            onChange={() => handleChange('hideProgressBar', !cardData.cardOptions.hideProgressBar)}
                            >
                            Masquer la progression
                            </Switch>
                        </div>

                        <div className="flex items-center mt-5 overflow-hidden">
                          <Slider 
                            label="Progression" 
                            step={5} 
                            maxValue={100} 
                            minValue={0} 
                            defaultValue={100}
                            value={cardData.cardOptions.progressBarPercent}
                            className="max-w-md"
                            onChange={(value) => handleChange('progressBarPercent', value as number)}
                          />
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
            </div>

            <div className="checkerboard grow rounded-lg p-5 text-center mt-10">
                <div>
                    <div className="overflow-auto lg:px-10 lg:pt-5">
                      <ImgCard {...cardData}></ImgCard>
                    </div>

                    <div className="flex">
                      <form action={handleSubmitDownload} className="mx-auto mt-5">
                          { download && (
                          <DownloadButton text="Télécharger"></DownloadButton>
                          )}
                      </form>
                    </div>
                </div>
              </div>
            </div>
        </div>
        <div className="text-center mt-3 text-sm text-white">
              Inspired by <Link href="https://www.youtube.com/c/BastiUI" className="text-indigo-300 font-semibold" target="_blank">@BastiUi</Link> & challenged by <Link href="https://www.youtube.com/c/BenjaminCode" className="text-indigo-300 font-semibold me-1" target="_blank">@benjaminCode</Link>
              - <Link href="https://github.com/larevuegeek/youtube-card-generator" className="text-white font-semibold" target="_blank">Github</Link>
          </div>
      </div>
      </NextUIProvider>
    );
}
