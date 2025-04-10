--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-10 13:40:24

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
-- TOC entry 242 (class 1255 OID 17252)
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
-- TOC entry 217 (class 1259 OID 17253)
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
-- TOC entry 218 (class 1259 OID 17259)
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
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 218
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 219 (class 1259 OID 17260)
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
-- TOC entry 220 (class 1259 OID 17265)
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
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 220
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- TOC entry 221 (class 1259 OID 17266)
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
-- TOC entry 222 (class 1259 OID 17269)
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
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 222
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- TOC entry 223 (class 1259 OID 17270)
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
-- TOC entry 224 (class 1259 OID 17278)
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
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 224
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 225 (class 1259 OID 17279)
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    product_id bigint NOT NULL,
    category_id bigint NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17282)
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
-- TOC entry 237 (class 1259 OID 17412)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id bigint NOT NULL,
    image_url character varying(255) NOT NULL,
    product_id bigint NOT NULL,
    original_filename character varying(255)
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17411)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO postgres;

--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 227 (class 1259 OID 17283)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    reference character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    price double precision NOT NULL,
    stock integer NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now(),
    updated_at timestamp(6) without time zone DEFAULT now(),
    image_url character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17290)
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
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 228
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 229 (class 1259 OID 17291)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17294)
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
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 230
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 231 (class 1259 OID 17295)
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
-- TOC entry 232 (class 1259 OID 17302)
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
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 232
-- Name: shopping_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_carts_id_seq OWNED BY public.shopping_carts.id;


--
-- TOC entry 239 (class 1259 OID 17463)
-- Name: user_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_info (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    type character varying(255) NOT NULL,
    document_type character varying(255) NOT NULL,
    document_number character varying(255) NOT NULL,
    document_exp date,
    exp_country character varying(255),
    exp_region character varying(255),
    exp_city character varying(255),
    first_name character varying(255),
    middle_name character varying(255),
    last_name character varying(255),
    second_last_name character varying(255),
    other_names character varying(255),
    legal_name character varying(255),
    email character varying(255) NOT NULL,
    country character varying(255) NOT NULL,
    region character varying(255),
    city character varying(255),
    address character varying(255),
    address_detail character varying(255),
    postal_code character varying(255),
    phone character varying(255),
    phone2 character varying(255),
    created_at date DEFAULT CURRENT_TIMESTAMP,
    updated_at date DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_info OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17462)
-- Name: user_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_info_id_seq OWNER TO postgres;

--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 238
-- Name: user_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_info_id_seq OWNED BY public.user_info.id;


--
-- TOC entry 241 (class 1259 OID 17519)
-- Name: user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role (
    id bigint NOT NULL,
    role_id bigint,
    user_id bigint
);


ALTER TABLE public.user_role OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 17518)
-- Name: user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_role ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 17303)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17306)
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
-- TOC entry 235 (class 1259 OID 17313)
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
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4802 (class 2604 OID 17314)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 17315)
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 17316)
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 17317)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 17425)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 17318)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 17319)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4815 (class 2604 OID 17320)
-- Name: shopping_carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts ALTER COLUMN id SET DEFAULT nextval('public.shopping_carts_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 17480)
-- Name: user_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info ALTER COLUMN id SET DEFAULT nextval('public.user_info_id_seq'::regclass);


--
-- TOC entry 4819 (class 2604 OID 17321)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5026 (class 0 OID 17253)
-- Dependencies: 217
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
62	11	8	1	680000	2025-03-31 14:37:04.995067	2025-03-31 14:37:04.995067	680000
63	12	1	1	500000	2025-03-31 15:59:19.889239	2025-03-31 15:59:19.889239	500000
64	12	6	1	220000	2025-03-31 15:59:36.32808	2025-03-31 15:59:36.32808	220000
65	12	8	2	680000	2025-03-31 15:59:46.046205	2025-03-31 15:59:46.046205	1360000
66	13	2	1	750000	2025-04-08 09:06:29.734372	2025-04-08 09:06:29.734372	750000
\.


--
-- TOC entry 5028 (class 0 OID 17260)
-- Dependencies: 219
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
-- TOC entry 5030 (class 0 OID 17266)
-- Dependencies: 221
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
19	11	8	1	680000	680000
20	12	1	1	500000	500000
21	12	6	1	220000	220000
22	12	8	2	680000	1360000
23	13	2	1	750000	750000
\.


--
-- TOC entry 5032 (class 0 OID 17270)
-- Dependencies: 223
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, cart_id, total, status, payment_method, pickup_location, created_at, billing_first_name, billing_last_name, billing_id_type, billing_id_number, billing_address, billing_address_detail, billing_country, billing_region, billing_city, billing_postal_code, billing_phone, billing_email, shipping_first_name, shipping_last_name, shipping_address, shipping_address_detail, shipping_country, shipping_region, shipping_city, shipping_postal_code, shipping_notes, coupon_code, shipping_method, accepted_terms) FROM stdin;
8	1	8	2360000	PENDING	efectivo_tienda	default_location	2025-03-29 19:05:05.336729	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	juan@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	recoger_tienda	t
9	1	9	1220000	PENDING	efectivo_tienda	default_location	2025-03-29 19:13:26.028963	Juan	Perez	CC	1000987655	calle 45 #45-22	202	Colombia	Cundinamarca	Bogotá	111011	3229843354	juan@gmail.com	Juana	Perez	carrera 134 #45-99	torre 5 606	Colombia	Antioquia	Medellín	111011	Ojala sirva manitooo	\N	recoger_tienda	t
10	1	10	700000	PENDING	efectivo_tienda	Bogotá, Carrera 27a #63g-46	2025-03-29 20:02:40.009877	Juan	Prueba	CC	1000238366	Calle 23 45-65	Torre 3 909	Colombia	Cundinamarca	Bogotá	111011	3229093484	ejemplo@gmail.com										\N	recoger_tienda	t
11	1	11	680000	PENDING	efectivo_tienda	Bogotá, Carrera 27a #63g-46	2025-03-31 15:24:59.113658	prueba1	prueba2	CC	122345677	calle 45 12054	122	Colombia	Cundinamarca	Bogotá	11121	3224565454	juan@gmail.com	prueba2	prueba2	calle 43 67	112	Colombia	Antioquia	Medellín	11121	que sirva gonorrea	\N	recoger_tienda	t
13	1	13	750000	PENDING	efectivo_tienda	Bogotá, Carrera 27a #63g-46	2025-04-08 09:07:12.891861	adfsefgsrg	rsgdrgdrg	CC	1243454356	gsdzrgrsg	grewgersg	Argentina	Buenos Aires	Mar del Plata	111011	32245654323	saapo@gmail.com										\N	recoger_tienda	t
12	2	12	2080000	SHIPPED	efectivo_tienda	Bogotá, Carrera 27a #63g-46	2025-03-31 16:18:06.082948	Prueba1	Prueba1	CC	1000967422	carrera 112 54 70	232	Colombia	Cundinamarca	Bogotá	111011	3226764532	maria@gmail.com	Prueba2	Prueba2	calle 123 #43-77	232	Colombia	Antioquia	Medellín	10111	SIRVA GONORREA	\N	recoger_tienda	t
\.


--
-- TOC entry 5034 (class 0 OID 17279)
-- Dependencies: 225
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (product_id, category_id, id) FROM stdin;
1	1	40
1	8	41
2	2	42
3	2	43
3	9	44
4	3	45
4	10	46
5	3	47
6	4	48
6	11	49
8	5	50
9	5	51
9	12	52
10	6	53
10	13	54
11	6	55
7	4	56
\.


--
-- TOC entry 5046 (class 0 OID 17412)
-- Dependencies: 237
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, image_url, product_id, original_filename) FROM stdin;
41	/assets/products/1/30037003-2007-43c4-a8c3-0d15ab539643-49st1200mc_pmv.png	1	49st1200mc_pmv.png
42	/assets/products/1/64b238a3-5238-475c-a89c-b197c114ff2d-560500064_H5_L2_R.png	1	560500064_H5_L2_R.png
43	/assets/products/1/5d0a60c6-5408-485a-baf4-e8443f761dbb-bateria-negra-web.png	1	bateria-negra-web.png
44	/assets/products/2/2fb85e9a-f0f0-4118-b61c-6408409777c1-alternador denso.webp	2	alternador denso.webp
45	/assets/products/2/1aef51cb-50e9-4d85-bc7a-df4af4de3f2f-alternador mitsubishi.jpg	2	alternador mitsubishi.jpg
46	/assets/products/2/b7c6cb14-890c-4e21-8127-d368c21555ca-alternador valeo.webp	2	alternador valeo.webp
47	/assets/products/3/125153c7-70a1-4e2d-9d3b-68e9c00a6e7c-alternador valeo.webp	3	alternador valeo.webp
48	/assets/products/4/81c56241-7584-425e-b40b-607c2eff99e9-bosch.jpg	4	bosch.jpg
49	/assets/products/4/c64ca4d8-fdaa-4937-8327-c45e731280a4-D_NQ_NP_874604-MLA47445996588_092021-O.webp	4	D_NQ_NP_874604-MLA47445996588_092021-O.webp
50	/assets/products/5/50a692d7-990b-4e8d-b116-21c2245fbb65-71xsHNz1RVL - copia.jpg	5	71xsHNz1RVL - copia.jpg
51	/assets/products/5/e638104d-2836-4028-8b91-aaa112115222-denso.jpg	5	denso.jpg
52	/assets/products/6/87936ec7-b099-4d1b-8964-a4d630918bce-images (2).jpeg	6	images (2).jpeg
53	/assets/products/8/412188e6-8f64-41ba-81f0-3a4438478657-bosch.jpg	8	bosch.jpg
54	/assets/products/8/a617ce50-dd59-453d-ade0-be50c582c361-gauss.jpg	8	gauss.jpg
55	/assets/products/8/deda8b3c-e0de-4415-8c0e-dba84e295bfd-mitsubishi.jpg	8	mitsubishi.jpg
56	/assets/products/9/85ccb42b-cba7-466c-a7d2-ee75581585ea-bosch.jpg	9	bosch.jpg
57	/assets/products/9/66283fba-c60d-43f8-9888-e466758ccc1e-hitachi.jpg	9	hitachi.jpg
58	/assets/products/9/89838db5-d0c5-4b2b-9eda-abd8d7d3f91b-mitsubishi.jpg	9	mitsubishi.jpg
59	/assets/products/10/ce65ed42-0ad4-46be-a516-833a52b39974-51TTc6mHFJL._AC_UF894,1000_QL80_.jpg	10	51TTc6mHFJL._AC_UF894,1000_QL80_.jpg
60	/assets/products/11/0b52255f-7cc8-42a1-9478-b68f586e2523-51TTc6mHFJL._AC_UF894,1000_QL80_.jpg	11	51TTc6mHFJL._AC_UF894,1000_QL80_.jpg
61	/assets/products/11/d5e63cd1-4915-47bf-93b1-94ddd3a88c58-40603.jpeg	11	40603.jpeg
62	/assets/products/7/029a40b1-95fb-41eb-9604-38fde190864b-D_NQ_NP_2X_940692-MCO70201981525_062023-T.webp	7	D_NQ_NP_2X_940692-MCO70201981525_062023-T.webp
63	/assets/products/7/65b9c1cd-8983-4b88-a9a1-1952cc8e24cf-images (2).jpeg	7	images (2).jpeg
\.


--
-- TOC entry 5036 (class 0 OID 17283)
-- Dependencies: 227
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, reference, name, description, price, stock, created_at, updated_at, image_url) FROM stdin;
4	20001	Bobina Bosch 0986JG	Bobina de encendido para motores de 4 cilindros, mejora el rendimiento del motor.	150000	15	2025-03-14 01:29:10.004605	2025-04-10 13:34:08.638754	/assets/products/4/main-f5ceefba-f5f1-4ee4-b4ca-249202b18599-bosch.png
5	20002	Bobina Denso 6731306	Bobina de ignición de alta resistencia para sistemas electrónicos modernos.	175000	12	2025-03-14 01:29:10.004605	2025-04-10 13:34:28.858808	/assets/products/5/main-4d6172a6-edf6-49cf-889e-ac595cae9481-71xsHNz1RVL.jpg
6	30001	Faros LED H7 Philips	Luces delanteras LED de alto brillo y bajo consumo energético.	220000	20	2025-03-14 01:29:10.004605	2025-04-10 13:34:53.151652	/assets/products/6/main-0d3a59bb-4b15-4a25-a990-ecbca5c3ed2c-D_NQ_NP_2X_940692-MCO70201981525_062023-T.webp
8	40001	Motor de arranque Denso 2.2KW	Motor de arranque potente para vehículos de gasolina y diésel.	680000	5	2025-03-14 01:29:10.004605	2025-04-10 13:35:25.78186	/assets/products/8/main-344f4d09-7001-48cb-bd8c-47a086a5e09d-gauss.jpg
9	40002	Motor de arranque Bosch 1.8KW	Arrancador compacto y eficiente, compatible con varias marcas.	720000	6	2025-03-14 01:29:10.004605	2025-04-10 13:35:47.053132	/assets/products/9/main-e9c756f8-8a91-4c6a-a20f-b9d3191f59be-81q9K35TaBL.jpg
10	50001	Regulador de voltaje Bosch 14V	Regulador electrónico para alternadores de 14V.	90000	30	2025-03-14 01:29:10.004605	2025-04-10 13:36:16.785683	/assets/products/10/main-9c2accaf-9dfc-4f63-8527-a6707aa932ed-40603.jpeg
11	50002	Regulador de voltaje Valeo 12V	Regulador confiable para alternadores de 12V, protege el sistema eléctrico.	85000	25	2025-03-14 01:29:10.004605	2025-04-10 13:36:29.433227	/assets/products/11/main-2de19eb3-600e-4cb5-ae01-4d3dc8d91cd5-418FKwa5r4L.jpg
1	79836	Bateria Bosch	Caja 35/65 (BCI), D23 (JIS)	500000	5	2025-03-10 21:48:23.217568	2025-04-09 08:29:58.796884	/assets/products/1/main-20d78c02-7686-4995-9089-df3f11e33a0c-duncan-libertyplus-27M-1000-2.png
2	10001	Alternador Bosch 12V 90A	Alternador de alto rendimiento compatible con múltiples modelos de automóviles.	750000	10	2025-03-14 01:29:10.004605	2025-04-10 13:33:08.558736	/assets/products/2/main-d064084a-6665-43c5-bcf1-285f0677788f-51vWrKA1SxL.jpg
7	30002	Kit de luces Xenón 6000K	Iluminación blanca intensa para una mejor visibilidad nocturna.	280000	10	2025-03-14 01:29:10.004605	2025-04-10 13:37:00.571125	/assets/products/7/main-28379ea7-eeb2-4ac5-81f9-bbcf8782f9a2-images.jpeg
3	10002	Alternador Valeo 14V 120A	Alternador de alta eficiencia, ideal para vehículos con mayor demanda eléctrica.	820000	8	2025-03-14 01:29:10.004605	2025-04-10 13:33:35.434818	/assets/products/3/main-47d65f51-e5c6-4b8d-b21b-9a2b9412f738-bosch2.webp
\.


--
-- TOC entry 5038 (class 0 OID 17291)
-- Dependencies: 229
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
1	ADMIN
2	USER
3	EMPLEADO
\.


--
-- TOC entry 5040 (class 0 OID 17295)
-- Dependencies: 231
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
11	1	COMPLETED	2025-03-31 14:37:04.967916	2025-03-31 14:37:04.967916
12	2	COMPLETED	2025-03-31 15:59:19.86608	2025-03-31 15:59:19.86608
13	1	COMPLETED	2025-04-08 09:06:29.691519	2025-04-08 09:06:29.691519
14	1	ACTIVE	2025-04-08 10:55:40.166614	2025-04-08 10:55:40.166614
\.


--
-- TOC entry 5048 (class 0 OID 17463)
-- Dependencies: 239
-- Data for Name: user_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_info (id, user_id, type, document_type, document_number, document_exp, exp_country, exp_region, exp_city, first_name, middle_name, last_name, second_last_name, other_names, legal_name, email, country, region, city, address, address_detail, postal_code, phone, phone2, created_at, updated_at) FROM stdin;
1	4	natural	CC	98786554	1999-03-01	Colombia	Cundinamarca	Bogota	Juan	Esteban	Peraza	Pinzon	NA	Juan SAS	juansas@gmail.com	COLOMBIA	cundinamarca	Bogota	carrera 12 23-88	casa 5 	111011	3108876654	2407783	\N	\N
2	5	Natural	DNI	12345678	\N	\N	\N	\N	Juan	\N	Pérez	\N	\N	\N	martin@gmail.com	Perú	\N	\N	\N	\N	\N	123456789	\N	\N	\N
3	6	Natural	DNI	12345678	\N	\N	\N	\N	Usuario	\N	Mostrador	\N	\N	-	prueba@gmail.com	-	-	-	-	-	-	-	-	\N	\N
4	7	natural	cedula	1000240844	2008-03-10	Colombia	Cundinamarca	Bogota	Juan	Esteban	Perraza	Pinzon	NA	Juan SAS	maincra2@gmail.com	Colombia	Cundinamarca	Bogota	Carrera 34 56-5	torre 4 202	1110111	3228765674	3227654537	\N	\N
\.


--
-- TOC entry 5050 (class 0 OID 17519)
-- Dependencies: 241
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_role (id, role_id, user_id) FROM stdin;
\.


--
-- TOC entry 5042 (class 0 OID 17303)
-- Dependencies: 233
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	1
2	2
4	2
5	2
6	2
7	2
\.


--
-- TOC entry 5043 (class 0 OID 17306)
-- Dependencies: 234
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at, updated_at) FROM stdin;
1	juanperez	juan.perez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
2	mariagonzalez	maria.gonzalez@example.com	$2a$12$.19iyV1u7ix26Rk1BIV/nuF37qAFHQ5YTYwegrCvehM1gGVxFGfBq	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
3	carlosramirez	carlos.ramirez@example.com	sapo123	2025-03-10 19:05:29.907813	2025-03-10 19:05:29.907813
4	minecraft	minecra@gmail.com	$2a$10$AzrqqLKaeG3009oLzcQ6yurM6CwkKVm.bAEXWxjKF0bqIHwzftAWa	2025-04-08 19:43:48.141715	2025-04-08 19:43:48.141715
5	martin03	martin@gmail.com	$2a$10$cB7vjt93AesE9fIqp9VLiuPzkEt1v4FbBSrYBXRtHYIfqNhSsB6ZS	2025-04-09 06:51:07.25703	2025-04-09 06:51:07.25703
6	Prueba2	prueba@gmail.com	$2a$10$EksgqHmJHThhM4JmeH6bseMLHE4HcT4LWGwXKEdfwia1tmN28XWgC	2025-04-09 07:08:16.498439	2025-04-09 07:08:16.498439
7	maincra2	maincra@gmail.com	$2a$10$9Xqn7Q2IeczhmOkKzLn0TOLZ7pZ8DTlphCQOvv7y3f1j2MhFHVlQu	2025-04-10 10:44:24.817621	2025-04-10 10:44:24.817621
\.


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 218
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 72, true);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 220
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 13, true);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 222
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 23, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 224
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 13, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 226
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 56, true);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_images_id_seq', 63, true);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 228
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 230
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 232
-- Name: shopping_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_carts_id_seq', 14, true);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 238
-- Name: user_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_info_id_seq', 4, true);


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 240
-- Name: user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_role_id_seq', 1, false);


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 4829 (class 2606 OID 17323)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4831 (class 2606 OID 17325)
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- TOC entry 4833 (class 2606 OID 17327)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 17329)
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 17331)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 17333)
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id);


--
-- TOC entry 4857 (class 2606 OID 17427)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4841 (class 2606 OID 17335)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 17337)
-- Name: products products_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_reference_key UNIQUE (reference);


--
-- TOC entry 4845 (class 2606 OID 17339)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 4847 (class 2606 OID 17341)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4849 (class 2606 OID 17343)
-- Name: shopping_carts shopping_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4859 (class 2606 OID 17474)
-- Name: user_info user_info_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_email_key UNIQUE (email);


--
-- TOC entry 4861 (class 2606 OID 17482)
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4863 (class 2606 OID 17523)
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- TOC entry 4851 (class 2606 OID 17345)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 4853 (class 2606 OID 17347)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4855 (class 2606 OID 17349)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2620 OID 17350)
-- Name: users trigger_update_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4864 (class 2606 OID 17351)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- TOC entry 4865 (class 2606 OID 17356)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4866 (class 2606 OID 17361)
-- Name: category fk_category_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- TOC entry 4867 (class 2606 OID 17366)
-- Name: order_details fk_order_details_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 17371)
-- Name: order_details fk_order_details_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4869 (class 2606 OID 17376)
-- Name: orders fk_orders_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_cart FOREIGN KEY (cart_id) REFERENCES public.shopping_carts(id) ON DELETE CASCADE;


--
-- TOC entry 4870 (class 2606 OID 17381)
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4877 (class 2606 OID 17506)
-- Name: user_info fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 17529)
-- Name: user_role fkj345gk1bovqvfame88rcx7yyx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT fkj345gk1bovqvfame88rcx7yyx FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4879 (class 2606 OID 17524)
-- Name: user_role fkt7e7djp752sqn6w22i6ocqy6q; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT fkt7e7djp752sqn6w22i6ocqy6q FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 4871 (class 2606 OID 17386)
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- TOC entry 4872 (class 2606 OID 17391)
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4876 (class 2606 OID 17420)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 17396)
-- Name: shopping_carts shopping_carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_carts
    ADD CONSTRAINT shopping_carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4874 (class 2606 OID 17401)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4875 (class 2606 OID 17406)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-04-10 13:40:28

--
-- PostgreSQL database dump complete
--

