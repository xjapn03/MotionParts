--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;  -- Actualiza la fecha/hora
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_price double precision,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    parent_id bigint
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    subtotal double precision NOT NULL
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_details_id_seq OWNER TO postgres;

--
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint,
    cart_id bigint NOT NULL,
    total double precision NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    payment_method character varying(255),
    pickup_location character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    billing_first_name character varying(255),
    billing_last_name character varying(255),
    billing_id_type character varying(255),
    billing_id_number character varying(255),
    billing_address character varying(255),
    billing_address_detail character varying(255),
    billing_country character varying(255),
    billing_region character varying(255),
    billing_city character varying(255),
    billing_postal_code character varying(255),
    billing_phone character varying(255),
    billing_email character varying(255),
    shipping_first_name character varying(255),
    shipping_last_name character varying(255),
    shipping_address character varying(255),
    shipping_address_detail character varying(255),
    shipping_country character varying(255),
    shipping_region character varying(255),
    shipping_city character varying(255),
    shipping_postal_code character varying(255),
    shipping_notes character varying(255),
    coupon_code character varying(255),
    shipping_method character varying(255),
    accepted_terms boolean DEFAULT false
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_id bigint NOT NULL,
    category_id bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.product_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.product_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    reference character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price integer NOT NULL,
    stock integer NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now(),
    image_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: shopping_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_carts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT shopping_carts_status_check CHECK (((status)::text = ANY (ARRAY[('ACTIVE'::character varying)::text, ('COMPLETED'::character varying)::text, ('CANCELLED'::character varying)::text])))
);


ALTER TABLE public.shopping_carts OWNER TO postgres;

--
-- Name: shopping_carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_carts_id_seq OWNER TO postgres;

--
-- Name: shopping_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_carts_id_seq OWNED BY public.shopping_carts.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: shopping_carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts ALTER COLUMN id SET DEFAULT nextval('public.shopping_carts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, quantity, unit_price, created_at, updated_at, total_price) FROM stdin;
42	1	1	2	500000	2025-03-25 11:08:59.921744	2025-03-25 11:08:59.921744	1000000
43	2	6	1	220000	2025-03-28 04:14:43.083007	2025-03-28 04:14:43.083007	220000
44	2	4	4	150000	2025-03-28 04:14:56.854715	2025-03-28 04:14:56.854715	600000
45	3	5	4	175000	2025-03-28 04:18:44.899127	2025-03-28 04:18:44.899127	700000
46	4	2	1	750000	2025-03-29 15:22:10.431662	2025-03-29 15:22:10.431662	750000
47	4	4	4	150000	2025-03-29 15:22:43.209962	2025-03-29 15:22:43.209962	600000
48	5	2	1	750000	2025-03-29 16:30:09.453744	2025-03-29 16:30:09.453744	750000
49	5	1	1	500000	2025-03-29 16:30:14.989152	2025-03-29 16:30:14.989152	500000
50	6	1	1	500000	2025-03-29 16:49:03.184294	2025-03-29 16:49:03.184294	500000
51	6	2	1	750000	2025-03-29 16:49:06.454981	2025-03-29 16:49:06.454981	750000
52	6	7	2	280000	2025-03-29 16:49:11.378988	2025-03-29 16:49:11.378988	560000
53	7	3	1	820000	2025-03-29 17:04:07.00953	2025-03-29 17:04:07.00953	820000
54	7	4	2	150000	2025-03-29 17:04:10.789976	2025-03-29 17:04:10.789976	300000
55	8	3	2	820000	2025-03-29 19:02:36.091618	2025-03-29 19:02:36.091618	1640000
56	8	9	1	720000	2025-03-29 19:02:40.887506	2025-03-29 19:02:40.887506	720000
57	9	1	1	500000	2025-03-29 19:11:41.556264	2025-03-29 19:11:41.556264	500000
58	9	5	2	175000	2025-03-29 19:11:46.847742	2025-03-29 19:11:46.847742	350000
59	9	7	1	280000	2025-03-29 19:11:50.525999	2025-03-29 19:11:50.525999	280000
60	9	10	1	90000	2025-03-29 19:11:54.762651	2025-03-29 19:11:54.762651	90000
61	10	5	4	175000	2025-03-29 20:01:39.019179	2025-03-29 20:01:39.019179	700000
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name, description, parent_id) FROM stdin;
1	Baterias	Baterias para automovil de diferentes tipos y marcas.	\N
2	Alternadores	Generadores eléctricos para automóviles que recargan la batería y alimentan los sistemas eléctricos.	\N
3	Bobinas de ignición	Componentes esenciales del sistema de encendido que transforman la corriente en alta tensión para las bujías.	\N
4	Luces	Diferentes tipos de iluminación para vehículos, incluyendo faros, luces traseras y auxiliares.	\N
5	Motores de arranque	Motores eléctricos diseñados para poner en marcha el motor de combustión interna del vehículo.	\N
6	Reguladores	Dispositivos que controlan la tensión eléctrica del alternador para evitar sobrecargas en el sistema.	\N
10	Bobinas completas línea	Bobinas en línea completas	3
8	Bateria Caja grande	Batería de caja 1000-1100	1
9	Alternador Tipo Valeo	Alternadores tipo Valeo original	2
11	Luces LED altas	Luces LED	4
12	Arranque Tipo Bosch	Motores de arranque tipo Bosch	5
13	Regulador Bosch	Reguladores marca Bosch	6
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, order_id, product_id, quantity, unit_price, subtotal) FROM stdin;
12	8	3	2	820000	1640000
13	8	9	1	720000	720000
14	9	1	1	500000	500000
15	9	5	2	175000	350000
16	9	7	1	280000	280000
17	9	10	1	90000	90000
18	10	5	4	175000	700000
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, cart_id, total, status, payment_method, pickup_location, created_at, billing_first_name, billing_last_name, billing_id_type, billing_id_number, billing_address, billing_address_detail, billing_country, billing_region, billing_city, billing_postal_code, billing_phone, billing_email, shipping_first_name, shipping_last_name, shipping_address, shipping_address_detail, shipping_country, shipping_region, shipping_city, shipping_postal_code, shipping_notes, coupon_code, shipping_method, accepted_terms) FROM stdin;
8	1	8	2360000	PENDING	efectivo_tienda	default_location	2025-03-29 19:05:05.336729	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	juan@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	recoger_tienda	t
9	1	9	1220000	PENDING	efectivo_tienda	default_location	2025-03-29 19:13:26.028963	Juan	Perez	CC	1000987655	calle 45 #45-22	202	Colombia	Cundinamarca	Bogotá	111011	3229843354	juan@gmail.com	Juana	Perez	carrera 134 #45-99	torre 5 606	Colombia	Antioquia	Medellín	111011	Ojala sirva manitooo	\N	recoger_tienda	t
10	1	10	700000	PENDING	efectivo_tienda	Bogotá, Carrera 27a #63g-46	2025-03-29 20:02:40.009877	Juan	Prueba	CC	1000238366	Calle 23 45-65	Torre 3 909	Colombia	Cundinamarca	Bogotá	111011	3229093484	ejemplo@gmail.com										\N	recoger_tienda	t
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_id, category_id, id) FROM stdin;
1	1	1
1	8	2
2	2	3
3	2	4
3	9	5
4	3	6
4	10	7
5	3	8
6	4	9
6	11	10
7	4	11
8	5	12
9	5	13
9	12	14
10	6	15
10	13	16
11	6	17
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) FROM stdin;
1	79836	Bateria Bosch	Caja 35/65 (BCI), D23 (JIS)	500000	5	2025-03-10 21:48:23.217568	2025-03-10 21:48:23.217568	\N
2	10001	Alternador Bosch 12V 90A	Alternador de alto rendimiento compatible con múltiples modelos de automóviles.	750000	10	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
3	10002	Alternador Valeo 14V 120A	Alternador de alta eficiencia, ideal para vehículos con mayor demanda eléctrica.	820000	8	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
4	20001	Bobina Bosch 0986JG	Bobina de encendido para motores de 4 cilindros, mejora el rendimiento del motor.	150000	15	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
5	20002	Bobina Denso 6731306	Bobina de ignición de alta resistencia para sistemas electrónicos modernos.	175000	12	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
6	30001	Faros LED H7 Philips	Luces delanteras LED de alto brillo y bajo consumo energético.	220000	20	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
7	30002	Kit de luces Xenón 6000K	Iluminación blanca intensa para una mejor visibilidad nocturna.	280000	10	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
8	40001	Motor de arranque Denso 2.2KW	Motor de arranque potente para vehículos de gasolina y diésel.	680000	5	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
9	40002	Motor de arranque Bosch 1.8KW	Arrancador compacto y eficiente, compatible con varias marcas.	720000	6	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
10	50001	Regulador de voltaje Bosch 14V	Regulador electrónico para alternadores de 14V.	90000	30	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
11	50002	Regulador de voltaje Valeo 12V	Regulador confiable para alternadores de 12V, protege el sistema eléctrico.	85000	25	2025-03-14 01:29:10.004605	2025-03-14 01:29:10.004605	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	ADMIN
2	USER
3	EMPLEADO
\.


--
-- Data for Name: shopping_carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopping_carts (id, user_id, status, created_at, updated_at) FROM stdin;
1	1	COMPLETED	2025-03-17 19:02:48.409567	2025-03-17 19:02:48.409567
2	1	COMPLETED	2025-03-28 04:14:43.07584	2025-03-28 04:14:43.07584
3	1	COMPLETED	2025-03-28 04:18:44.896335	2025-03-28 04:18:44.896335
4	1	COMPLETED	2025-03-29 15:22:10.383349	2025-03-29 15:22:10.383349
5	1	COMPLETED	2025-03-29 16:30:09.421446	2025-03-29 16:30:09.421446
6	1	COMPLETED	2025-03-29 16:49:03.154536	2025-03-29 16:49:03.154536
7	1	COMPLETED	2025-03-29 17:04:06.977794	2025-03-29 17:04:06.977794
8	1	COMPLETED	2025-03-29 19:02:36.085094	2025-03-29 19:02:36.085094
9	1	COMPLETED	2025-03-29 19:11:41.528676	2025-03-29 19:11:41.528676
10	1	COMPLETED	2025-03-29 20:01:39.013673	2025-03-29 20:01:39.013673
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	1
2	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at, updated_at) FROM stdin;
1	juanperez	juan.perez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
2	mariagonzalez	maria.gonzalez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
3	carlosramirez	carlos.ramirez@example.com	sapo123	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
\.


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 61, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 13, true);


--
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 18, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 17, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: shopping_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_carts_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_reference_key UNIQUE (reference);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: shopping_carts shopping_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users trigger_update_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: category fk_category_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- Name: order_details fk_order_details_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_details fk_order_details_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_cart FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: shopping_carts shopping_carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

